using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ShoppingProject.Dtos.File;
using ShoppingProject.Helpers;
using ShoppingProject.Interfaces;
using static ShoppingProject.Services.StorageService;

namespace ShoppingProject.Services
{
    public class StorageService(IConfiguration configuration) : IStorageService
    {
        private IConfiguration _configuration = configuration;

        public async Task<ResponseApp<string>> UploadAsync(FileDto file, CancellationToken ct = default)
        {
            string filename = $"{Guid.NewGuid().ToString().Replace("-", "")}.{file.Extension}";
            string uri = _configuration.GetConnectionString("BlobStorage")!;
            string containerName = file.GroupId.ToString();

            var blobServiceClient = new BlobServiceClient(uri);

            // Get a reference to the container
            var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create the container if it doesn't exist
            await blobContainerClient.CreateIfNotExistsAsync(publicAccessType: Azure.Storage.Blobs.Models.PublicAccessType.Blob);

            // Get a reference to the blob
            var blobClient = blobContainerClient.GetBlobClient(filename);

            var blobUploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders { ContentType = this.GetContentType(file.Extension) }
            };

            await using (Stream? data = file.Stream.OpenReadStream()!)
            {
                await blobClient.UploadAsync(data, blobUploadOptions, ct);
            }

            // Return the URL of the uploaded blob
            string blobUrl = blobClient.Uri.ToString();
            return new ResponseApp<string>()
            {
                Content = blobUrl,
                Success = true,
            };
        }
        private string GetContentType(string fileExtension)
        {
            if (string.IsNullOrEmpty(fileExtension))
            {
                return "application/octet-stream"; // Default content type for unknown extensions
            }

            if (fileExtension.StartsWith("."))
            {
                fileExtension = fileExtension.Substring(1); // Remove leading dot
            } else
            {
                fileExtension = "." + fileExtension;
            }

            var contentTypeProvider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();

            if (contentTypeProvider.TryGetContentType(fileExtension, out var contentType))
            {
                return contentType;
            }

            return "application/octet-stream"; // Default content type if mapping not found
        }
    }
}
