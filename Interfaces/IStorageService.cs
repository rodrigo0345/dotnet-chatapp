using ShoppingProject.Helpers;

namespace ShoppingProject.Interfaces
{
    public interface IStorageService
    {
        public interface IStorageService
        {
            public Task<ResponseApp<string>> StoreBlobAsync(Stream blob, User user, CancellationToken cancellationToken = default);
            public Task<ResponseApp<Stream>> GetBlobAsync(string path, User loggedUser, CancellationToken cancellationToken = default);
            public Task<string> ListAllBlobInfo(string path);
        }
    }
}
