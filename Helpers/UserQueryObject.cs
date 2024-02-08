namespace ShoppingProject.Helpers
{
    public class UserQueryObject
    {
        public string? FilterBy { get; set; }
        public string? FilterValue { get; set; }
        public string? SortBy { get; set; }
        public bool isAscending { get; set; } = true;
        public int Page { get; set; } = 0;
        public int PageSize { get; set; } = 10;
    }
}
