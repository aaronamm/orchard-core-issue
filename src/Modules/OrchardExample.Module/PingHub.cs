using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OrchardCore.ContentManagement;
using YesSql;

namespace OrchardExample.Module;

// How to reproduce an error:
// Follow README.md to run the project.
// Navigatge to https://localhost:5001 will execute signalR connection.start() in Ping.ts
// This will request to PingHub which has ISession as a dependency and cause an error message.
// We don't need to do anything on a session instance, just make it as dependency of signalR Hub.
// The error message is in App_Data/logs/ folder.

public class PingHub : Hub
{
    private readonly ILogger _logger;
    private readonly ISession _session;

    public PingHub(ILogger<PingHub> logger, ISession session)
    {
        _logger = logger;
        _session = session;
    }


    // If a user hasn't logged in, this is called with in a second Hub instance.
    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        _logger.LogInformation("signalR connectId {connectionId}", connectionId);
        await Clients.Caller.SendAsync("pong", "Pong pong....");
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return Task.CompletedTask;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
    }
}
