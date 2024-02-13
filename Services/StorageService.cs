using Azure.Storage.Blobs;
using ShoppingProject.Helpers;
using ShoppingProject.Interfaces;
using static ShoppingProject.Services.StorageService;

namespace ShoppingProject.Services
{
    public class StorageService: IStorageService
    {

            private readonly BlobServiceClient _BlobServiceClient;

            public StorageService(BlobServiceClient blobServiceClient)
            {
                _BlobServiceClient = blobServiceClient;
            }

        public async Task<ResponseApp<Stream>> GetBlobAsync(string path, string groupId, CancellationToken cancellationToken = default)
        {
            var clientContainer = _BlobServiceClient.GetBlobContainerClient(groupId);

            var blobClient = clientContainer.GetBlobClient("videos");
            var result = await blobClient.DownloadToAsync(path, cancellationToken);

            if (result.Status != 200 || result.ContentStream == null)
            {
                return new ResponseApp<Stream>
                {
                    ErrorMessage = $"Error downloading file. Status: {result.Status}"
                };
            }

            return new ResponseApp<Stream>
            {
                Success = true,
                Content = result.ContentStream
            };
        }

        public async Task<string> ListAllBlobInfo(string groupId)
        {
            // Implement the logic to list blob information here
            // You might want to return a list of blob information or other relevant data
            throw new NotImplementedException();
        }

        public async Task<ResponseApp<string>> StoreBlobAsync(Stream blob, string groupId)
        {
            // Consider using a GUID for a more robust blob ID generation
            string blobID = $"{groupId}/{Guid.NewGuid()}";

            // Connect to the Azure Blob Storage container
            var clientContainer = _BlobServiceClient.GetBlobContainerClient(groupId);

            // Create a block blob client
            var blobClient = clientContainer.GetBlobClient(blobID);

            // Upload the content stream to Azure Blob Storage
            var result = await blobClient.UploadAsync(blob, true);

            if (result.GetRawResponse().Status != 201)
            {
                return new ResponseApp<string>
                {
                    ErrorMessage = $"Error uploading file. Status: {result.GetRawResponse().Status}"
                };
            }

            return new ResponseApp<string>
            {
                Success = true,
                Content = blobID,
            };
        }
    }
}
