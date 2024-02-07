using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Xunit;
using chatapp;
using chatapp.Dtos.Message;
using Microsoft.AspNetCore.Hosting;
using ShoppingProject.Dtos.User; // Adjust namespaces based on your project structure

public class ChatGroupControllerTest
{

    private readonly WebApplicationFactory<IStartup> _factory;

    public ChatGroupControllerTest(WebApplicationFactory<IStartup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task TestCreateChatGroup()
    {
        // Arrange
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false // Disable auto-redirect to capture response
        });

        var loginCred = new LoginDto
        {
            Password = "admin",
            Username = "admin"
        };

        var auth = await client.PostAsJsonAsync("api/account/login", loginCred);

        Assert.Equal(HttpStatusCode.OK, auth.StatusCode);

        Console.WriteLine(auth.Headers.WwwAuthenticate);

        // Add the token to the client's request headers
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth.Headers.WwwAuthenticate}");

        var createChatGroupDto = new CreateChatGroupDto
        {
            Name = "Test Group",
            Logo = "https://example.com/logo.png",
            OwnerId = "123" // Replace with a valid user id
        };

        // Act
        var response = await client.PostAsJsonAsync("api/group", createChatGroupDto);

        // Assert
        Assert.Equal(200, (int)response.StatusCode); // Expecting a successful response if authenticated

        // Optionally, deserialize the response content if needed
        var responseData = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<ChatGroupDto>(responseData);

        // Additional assertions based on your expected behavior
        Assert.NotNull(result);
        // Perform more assertions as needed
    }
}
