namespace ShoppingProject.Helpers
{
    public class ResponseApp<TContent>
    {
        public bool Success { get; set; } = false;
        public string? ErrorMessage { get; set; }
        public TContent? Content { get; set; }
    }
}
