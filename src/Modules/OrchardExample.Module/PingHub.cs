using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OrchardCore.ContentManagement;

namespace OrchardExample.Module;

// How to reproduce an error:
// Follow README.md to run the project.
// Navigatge to https://localhost:5001 will execute signalR connection.start() in Ping.ts
// This will request to PingHub which has ContentManager as dependency and cause an error message.
// We don't need to do anything on contentManager, just make it as dependency of signalR Hub.
// The error message is in App_Data/logs/

public class PingHub : Hub
{
    private readonly ILogger _logger;
    private readonly IContentManager _contentManager;

    // If a user hasn't logged in, this contrctor is called two times.
    public PingHub(ILogger<PingHub> logger, IContentManager contentManager)
    {
        _logger = logger;
        _contentManager = contentManager;
    }


    // If a user hasn't logged in, this is called with in a second Hub instance.
    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        _logger.LogInformation("signalR connectId {connectionId}", connectionId);
        await Clients.Caller.SendAsync("pong", "Pong pong....");
    }
}
