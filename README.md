# orchard-core-issue
Example project to reproduce OC issues

## To run the project

- Build Node.js project
```sh
# At root of the project 
$ yarn
$ yarn run dev
```

- Start the website
```sh
# At root of the project 
$ dotnet watch run --project src/OrchardExample.Cms/OrchardExample.Cms.csproj
```

Set up a new website with 

- Open a web browser and navigate to https://localhost:5001

- Select the `Blank site` recipe and wait for a while until the setup has finished.
- Log in to admin page and enable `OrchardExample.Module` module.
- Change theme to `The Default Theme`.
- Go to https://localhost:5001
- Check `OrchardExample.Cms/App_Data/logs`
- If you check a developer console tool of a browser, you will find messages like these: 
```txt
connected with id HpHmHycEwCTe3dWbhA9D5Q
Ping.ts:9 Got a response message as Pong pong....
```

## Other tips
Add a project to the solution
```sh
$ dotnet sln add ./src/Modules/OrchardExample.Module/OrchardExample.Module.csproj
```

## Exception messages

```txt
2025-05-18 13:08:36.1195|Default|00-7698c87ab758c47f61a3a49cb5750f29-efb5ea0bc6ac562d-00|1|Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddleware|ERROR|An unhandled exception has occurred while executing the request. System.InvalidOperationException: Collection was modified; enumeration operation may not execute.
   at OrchardCore.Environment.Shell.Scope.ShellScope.BeforeDisposeAsync()
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Modules.ModularTenantContainerMiddleware.Invoke(HttpContext httpContext)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)    
   at OrchardCore.Environment.Shell.Scope.ShellScope.BeforeDisposeAsync()
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Modules.ModularTenantContainerMiddleware.Invoke(HttpContext httpContext)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)

   
2025-05-18 13:08:36.1195|Default|00-7698c87ab758c47f61a3a49cb5750f29-efb5ea0bc6ac562d-00|2|Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddleware|WARN|The response has already started, the error page middleware will not be executed. 

2025-05-18 13:08:36.1195|Default|00-7698c87ab758c47f61a3a49cb5750f29-efb5ea0bc6ac562d-00|13|Microsoft.AspNetCore.Server.Kestrel|ERROR|Connection id "0HNCLPSFARDRK", Request id "0HNCLPSFARDRK:00000057": An unhandled exception was thrown by the application. System.InvalidOperationException: Collection was modified; enumeration operation may not execute.
   at OrchardCore.Environment.Shell.Scope.ShellScope.BeforeDisposeAsync()
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Modules.ModularTenantContainerMiddleware.Invoke(HttpContext httpContext)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Session.SessionMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Session.SessionMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Watch.BrowserRefresh.BrowserRefreshMiddleware.InvokeAsync(HttpContext context)
   at Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http.HttpProtocol.ProcessRequests[TContext](IHttpApplication`1 application)    at OrchardCore.Environment.Shell.Scope.ShellScope.BeforeDisposeAsync()
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Environment.Shell.Scope.ShellScope.UsingAsync(Func`2 execute, Boolean activateShell)
   at OrchardCore.Modules.ModularTenantContainerMiddleware.Invoke(HttpContext httpContext)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Session.SessionMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Session.SessionMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Watch.BrowserRefresh.BrowserRefreshMiddleware.InvokeAsync(HttpContext context)
   at Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http.HttpProtocol.ProcessRequests[TContext](IHttpApplication`1 application)
```
