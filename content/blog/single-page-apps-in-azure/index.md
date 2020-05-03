---
title: "Delivering single page apps with ASPNET Core in Azure"
description: "Test description"
slug: ""
cover: "https://unsplash.it/1152/300/?random?FaityWitch"
date: "2018-08-06"
topics:
    - "cloud"
tags:
    - "azure"
---

This article is an update to a [previous article](https://sethreid.co.nz/delivering-single-page-apps-aspnet-core/) where I described how to serve a single page JavaScript app with ASP.NET Core. The reason for the update is that I've changed the way that I approach doing this. I think the new approach is easier and it has the benefit of being more performant, since it uses IIS to serve static files rather than the ASP.NET Core middleware. This example is using React and [Create React App](https://github.com/facebook/create-react-app), but it will work with any modern JavaScript framework, for example Angular or Vue, and where there would be some requirement to alter my approach I'll note it.

> **Note:** To see a complete implementation of this approach see [this Github repository](https://github.com/sethreidnz/aspnet-core-spa).

## What are the goals of this approach?

When using modern JavaScript frameworks you get a lot of productivity wins by using the supported CLI or project generation tools. In this case I am using [Create React App](https://github.com/facebook/create-react-app) which, among other things, provides a live reloading development server.

My high level goals with this approach are:

- Use the default development experience from Create React App for building my client app
- Use ASP.NET as my API
- Serve and deploy the production build of the client app with the API
- Deploy to an Azure Web App

This way I get the best of both worlds; I can use Create React App and I can also use .NET core as my backend without compromises. It also means the frontend team can point the client app to a remote deployment of the API and not have to run the it on their machine when they shouldn't need to, and the backend developers don't need to run the client application either.

## How does the approach work?

The implementation involves the following:

- Two separate projects - `src/client` (Create React App) and `src/server` (ASP.NET Core MVC)
- Using Create React App `npm start` in development - Use this during development and point API requests to the server at `http://localhost:5000`
- Enable CORS in development mode - To allow for the front end application
- Use web.config reroute rules - Ensure that the static files are served by IIS but API requests are let through to the MVC backend

I generally deploy these applications to Azure but it will work in any IIS website. Keep reading to understand how I've achieved this approach.

### Two separate projects

If you look in the companion [Github repository](https://github.com/sethreidnz/aspnet-core-spa) you will see two folders `src/client` and `src/server`. These are essentially unrelated projects - you are able to run them independently with their own runtimes.

### Using Create React App `npm start` in development

This can be achieved by using the existing [dotenv](https://www.npmjs.com/package/dotenv) support in Create React App, which allows you to set a different value for your API host when running with `npm start` and when you build the production app with `npm run build`. This is done with the two files in the repo [`src/client/.env`](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/client/.env) and [`src/client/.env.production`](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/client/.env.production).

> **Note:** This approach would have to be altered when using Angular or Vue for example but should be easy enough to achieve

In `src/client/.env`:

```lang-sh
REACT_APP_API_HOST=http://localhost:5000/
```

In `src/client/.env.production`:

```lang-sh
REACT_APP_API_HOST=/
```

This means if you use this variable, `process.env.REACT_APP_API_HOST`, in your app as I have in the file [`src/api/config.js`](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/client/src/api/config.js) the `REACT_APP_API_HOST` value is going to be `http://localhost:5000/` when running `npm start` and will be the current host that is serving the app when its build using `npm run build`.

As I mentioned if you had development server at `https://my-development-server.azurewebsites.net`, you could get frontend developers to add the file `src/client/.env.local` with the following content and they wouldn't need to worry about the API project at all:

```lang-sh
REACT_APP_API_HOST=https://my-development-server.azurewebsites.net/
```

### Enable CORS during development

In order to make this work in development we need to get around the [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) restrictions which would mean that if you make an HTTP request from your client app at `http://localhost:3000` to the server at `http://localhost:5000` it won't work. However we want to make sure that in production we are secure and don't allow other domains to make requests to our server.

We can do this by adding the following CORS policy to the file [src/server/Startup.cs](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/server/Startup.cs#L29):

```lang-csharp
services.AddCors(options => options.AddPolicy("AllowAll", policy => policy
.AllowAnyOrigin()
.AllowAnyMethod()
.AllowAnyHeader()));
```

This is defining a CORS policy to allow all origins for simplicity since we are only going to enable this when running in development mode. To do this you can add the following to [src/server/Startup.cs](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/server/Startup.cs#L42):

```lang-csharp
if (env.IsDevelopment())
{
app.UseDeveloperExceptionPage();
app.UseCors("AllowAll"); // in development enable the AllowAll cors policy
}
else
{
app.UseHsts();
}
```

See the full implementation in the [Github repository here](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/server/Startup.cs#L42)

### Use web.config reroute rules

The final piece of this implementation is using a `web.config` to achieve the following:

1. Static Assets - All requests for assets such as images, CSS and JavaScript are re-written to be served from the wwwroot folder
1. Correct MIME types for static assets - The correct MIME types are setup so that the various static assets are served correctly by IIS
1. Requests for the root of the site - If a request for the root of the site (e.g. https://my-spa-application.azurewebsites.net) the `wwwroot/index.html` is served
1. All requests that do not start with `/api/` are redirected to the `wwwroot/index.html` file in the server application
1. All requests that start with `/api/` are allowed to pass through to the ASP.NET application
1. Caching is disabled on the file `wwwroot/index.html` so that when we redeploy the new version of the file is served, along with the updated JavaScript and CSS files

The full web.config can be found in the repository [here](https://github.com/sethreidnz/aspnet-core-spa/blob/master/src/server/web.config) but I'll explain the key pieces.

#### Static Assets

The first re-write rule is the following:

```lang-xml
<rule name="wwwroot-static" stopProcessing="true">
  <match url="([\S]+[.](html|htm|svg|js|css|png|gif|jpg|jpeg|ico))" /><!-- Handle static file requests and server them from the wwwroot -->
  <conditions logicalGrouping="MatchAll">
    <add input="{HTTP_METHOD}" pattern="GET|HEAD" />
  </conditions>
  <action type="Rewrite" url="wwwroot/{R:1}" />
</rule>
```

This rule will catch all requests for the file types `html|htm|svg|js|css|png|gif|jpg|jpeg|ico` and reroute them to get them from the folder `wwwroot`. If you have other file types then you need to add them to this rule.

## Correct MIME types for static assets

The following section inside the `` section will add most of the common MIME types, extra MIME types such as video will need to be added here.

```lang-xml
<handlers>
  <add name="StaticFileModuleHtml" path="*.htm*" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleSvg" path="*.svg" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleJs" path="*.js" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleCss" path="*.css" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleJpeg" path="*.jpeg" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleJpg" path="*.jpg" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModulePng" path="*.png" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleGif" path="*.gif" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="StaticFileModuleIco" path="*.ico" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModule" resourceType="Unspecified" />
</handlers>
```

#### Requests for the root of the site

To handle requests to the root of the site:

```lang-xml
<rule name="empty-root-index" stopProcessing="true">
  <match url="^$" /><!-- Handle requests to the root of the site and route it to the wwwroot/index.html -->
  <conditions logicalGrouping="MatchAll">
    <add input="{HTTP_METHOD}" pattern="GET|HEAD" />
    <add input="{QUERY_STRING}" pattern="^$|^lc=" />
  </conditions>
  <action type="Rewrite" url="wwwroot/index.html" />
</rule>
```

This will reroute the requests with or without a `/` to serve the `wwwroot/index.html`.

#### Handling Client Side Routes

Single page applications usually have routes that need to be handled by the frontend and not the server, for example `https://my-development-server.azurewebsites.net/my-client-route`. To do this we create a rule that will catch all requests that are not for a file or folder or don't start with `/api/` and pass the route onto the `wwwroot/index.html` like this:

```lang-xml
<rule name="html5-routes" stopProcessing="true">
  <match url=".*" /><!-- Handle all paths except /api/ and pass the route onto the wwwroot/index.html -->
  <conditions logicalGrouping="MatchAll">
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /><!-- Add rule to negate file requests e.g. css/html/images-->
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /><!-- Add rule to negate directories-->
    <add input="{REQUEST_URI}" pattern="^/api/" negate="true" /><!-- Add rule to negate paths and let them through the MVC-->
    <add input="{HTTP_METHOD}" pattern="GET|HEAD" />
  </conditions>
  <action type="Rewrite" url="wwwroot/index.html" />
</rule>
```

The main thing to note here is the line where we negate the path `/api/`:

```lang-xml
<add input="{REQUEST_URI}" pattern="^/api/" negate="true" />
```

If you would like to add other paths to let through then you would just add to that line, for example if you had a regular MVC controller to handle accounts at the path `/account` you would could update the line to be like this:

```lang-xml
<add input="{REQUEST_URI}" pattern="^/api/|^/account/" negate="true" />
```

## Summary

I've used this approach in numerous applications and have found it to be really effective and extremely easy to setup. I really like how it means that the front-end and the back-end are loosely coupled, meaning that parts of the team who work on each don't need to worry about how to setup and run the parts they aren't working on.

If you want to try running this locally or test this out and deploy it to Azure then check out the [detailed README here](https://github.com/sethreidnz/aspnet-core-spa), or have a look at the various ways you can deploy to Azure [here](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/azure-apps/?view=aspnetcore-2.1).

## More Reading

- [Deploying ASPNET Core Apps with VSTS](https://sethreid.co.nz/dotnet-core-vsts-hosted-agents/)
- [Deploying a Create React App project to Azure with VSTS Build and Release](https://sethreid.co.nz/deploying-create-react-app-project-azure-vsts-build-release/)