using ShoppingProject.Dtos.File;
using ShoppingProject.Helpers;

namespace ShoppingProject.Interfaces
{
    public interface IStorageService
    {
       public Task<ResponseApp<string>> UploadAsync(FileDto file, CancellationToken cancellationToken = default);
    }
}
