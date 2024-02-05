using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ccnd.Interfaces.Repositories
{
    public interface IRepository<DTO, QOBJ, CDTO, UDTO>
        where DTO : class
        where QOBJ : IQueryObject
        where CDTO : ICreateDto
        where UDTO : IUpdateDto
    {
        public Task<DTO?> getOneAsync(Guid id, CancellationToken cancellationToken = default);
        public Task<List<DTO>> getAllAsync(QOBJ queryObject, CancellationToken cancellationToken = default);

        // string is returning any possible errors
        public Task<DTO?> createOneAsync(CDTO model, CancellationToken cancellationToken = default);

        // string is returning any possible errors
        public Task<DTO?> updateOneAsync(UDTO model, CancellationToken cancellationToken = default);

        public Task<string?> deleteOneAsync(Guid id, CancellationToken cancellationToken = default);
    }
}