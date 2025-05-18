using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OrchardCore.ContentManagement;

namespace OrchardExample.Module;

public class PingHub : Hub
{
    private readonly ILogger _logger;
    private readonly IContentManager _contentManager;

    public PingHub(ILogger<PingHub> logger, IContentManager contentManager)
    {
        _logger = logger;
        _contentManager = contentManager;
    }

    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        _logger.LogInformation("signalR connectId {connectionId}", connectionId);
        await Clients.Caller.SendAsync("pong", "Pong pong....");
    }

}
