---
title: "Creating a new React and Dotnet project"
description: "Test description"
slug: "creating-a-new-donet-and-react-project"
cover: "https://unsplash.it/1152/300/?random?TheButterflyoftheEdge"
date: "2019-06-02"
topics: 
    - "web-development"
tags:
    - "javascript"
    - "react"
    - "csharp"
---

The .NET Core CLI makes it really easy to create a new projects with .NET Core. By running `dotnet new react` you get a basic .NET Core MVC app setup to serve and build a React app using [Create React App](https://facebook.github.io/create-react-app/). This is great, and I believe is the best way to create a new React project with .NET, however as of .NET Core 2 the template outputs an out-of-date version of a basic ReactJS app created with Create React App. This article is a step by step guide to how to still use this template but have the latest version of Create React App's output in your project.

## Pre-requisites

You will need to have the following installed:

- [.NET Core SDK](https://dotnet.microsoft.com/download)
- [NodeJS](https://nodejs.org/en/)
- [Create React App](https://facebook.github.io/create-react-app/)
- Optionally: [Git](https://git-scm.com/downloads)

## Creating a new project - Step by step

Let's get straight to it with a step by step guide to creating a new ReactJS project with the .NET Core CLI.

1. Open the command line and run the following to create the base project:

    > **Note:** replace `MyNewProject` with the name of your new project

    ``` sh
    dotnet new react -n MyNewProject
    ```

1. Change directory into your new project:

    ``` sh
    cd MyNewProject
    ```

1. Run the following to delete the existing ReactJS app that was created:

    ``` sh
    rm -rf ClientApp
    ```

1. **Optional step:** If you want to create a Git repository for the project make sure you do it now since Create React App will create one in it's output folder in the next step if you don't. Run the following

    ``` sh
    git init
    ```

1. Run the following to create a brand new React Application (this may take a few minutes):

    > **Note:** replace `my-new-project` with the name of your new project in snake case

    ```
    create-react-app my-new-project
    ```

1. Rename the folder that was output to from the snake-case name to `ClientApp`. For example:

    ```
    rename my-new-project ClientApp
    ```

That's it! Now you can run the project by opening it in Visual Studio, or Visual Studio Code!

## Why is this necesary? A look into the future

This is necesary at the moment because of the way that templating is done in .NET Core 2. The `ClientApp` folder is [checked in to the repository](https://github.com/aspnet/AspNetCore/tree/master/src/ProjectTemplates/Web.Spa.ProjectTemplates/content/React-CSharp) so it doesn't get updated. As described in [answer to a Github issue](https://github.com/aspnet/templating/issues/242#issuecomment-359865442) it is explained that Microsoft's aim" is consistency with the SPA frameworks' de-facto standards, not extending them to include other technologies". This is great news but until the new version come out we will just have to keep doing the above.