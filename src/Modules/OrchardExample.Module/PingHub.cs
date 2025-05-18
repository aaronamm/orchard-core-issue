using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace OrchardExample.Module;

public class PingHub : Hub
{
    private readonly ILogger _logger;

    public PingHub(ILogger<PingHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        _logger.LogInformation("signalR connectId {connectionId}", connectionId);
        await this.Clients.Caller.SendAsync("pong", "Pong pong....");
    }

}
