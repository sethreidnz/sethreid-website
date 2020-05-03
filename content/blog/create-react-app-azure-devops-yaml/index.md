---
title: "Building Create React App with Azure Devops YAML"
description: "Test description"
slug: "building-create-react-app-with-azure-devops-yaml"
cover: "https://unsplash.it/1152/300/?random?FaityWitch"
date: "2019-01-20"
topics: 
    - "web-development"
    - "devops"
tags:
    - "azure"
    - "react"
---

In 2018 Microsoft re-launched VSTS as [Azure Devops](https://azure.microsoft.com/en-us/services/devops/) with a new UI and a bunch of new features. The best new feature in my opinion is that you can create your build configurations in code using YAML. Visual editors can be great but I prefer to put my build definition directly in my repo and have full control over what happens.

In this article I wanted to give a simple and easy guide to how to build a React app that was created using Create React App using the new YAML configuration. I have created a [Github repo here](https://github.com/sethreidnz/azure-devops-examples) that has multiple examples in it which you can look to as a reference.

> **Note:** One thing you might notice is I have multiple .yml files in one repository. If you would like to know how to do that see my other article [Using multiple YAML build definitions in Azure Devops](https://sethreid.co.nz/using-multiple-yaml-build-definitions-azure-devops/).

Imagine you have the following project structure:

```
src/
   react/ # React app here
azure-pipelines.yml
```

YAML build definitions make it really simple to run a build, and create a production package while keeping all of your build definition along side the code you are building. In this tutorial I'm going to walk through the steps I've used to build a Create React App into a package for deployment.

## Examining our YAML file

In my [Azure Devops Examples repo](https://github.com/sethreidnz/azure-devops-examples) there is a file [react-pipeline.yml](https://github.com/sethreidnz/azure-devops-examples/blob/master/react-pipeline.yml). Don't worry if you don't understand what is going on, I am going to walkthrough each step below.

### Defining the virtual machine image

The first section of the file selects the VM image that you want to run your build on. You can choose between the [available images](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=vsts&tabs=yaml#use-a-microsoft-hosted-agent) which includes Linux, Windows and MacOS:

```xml
# define the VM image I want to use for my build
pool:
  vmImage: 'Ubuntu 16.04'
```

Here I am using Ubuntu 16.04.

### Defining build variables

Azure Build Pipeline will give you a number of predefined [build](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=vsts) and [release](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/variables?view=vsts) variables but in your YAML file you can define your own. This means that you don't need to repeat the same strings and values throughout your build.

In this React example I have defined `projectFolder` and `buildOutputFolder` for using later in the script:

```xml
# define variables to use during the build
variables:
  projectFolder: 'src/react'
  buildOutputFolder: 'src/react/build'
```

### Defining the steps of the build

This is the main section of your build where you can define both custom scripts to run as well as use all of the [build-in tasks](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/?view=vsts) you can use in the GUI editor. You can also use "jobs" for more complex build [see the documentation here](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=vsts) if you are interested in learning more. For this simple build I am just going to use steps.

First you have the key word `steps:` which you use to define a number of tasks or scripts

```xml
# define the steps of the build
steps:
```

#### Running custom scripts

First I have defined a script that will run the install and build for the React application:

```xml
## Run the npm install/build
- script: |
    pushd $(projectFolder) && npm install && popd
    pushd $(projectFolder) && npm run build && popd
```

Notice how I have used the powershell syntax `$(projectFolder)` to use variables I defined earlier. These scripts can be used to script any task and on Linux/MacOS will run using sh, while on Windows they will use cmd.exe.

#### Running build in tasks

A task is the building block for defining automation in a build pipeline, or in a stage of a release pipeline. A task is simply a packaged script or procedure that has been abstracted with a set of inputs. 

I have used the following tasks (click on the task to see its' documentation):

- [`CopyFiles`](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/copy-files?view=vsts&tabs=yaml) - to copy the files from the React build output into the staging directory.
- [`ArchiveFiles`](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/archive-files?view=vsts) to create a zip from the staging directory
- [`PublishBuildArtifacts`](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/publish-build-artifacts?view=vsts) to publish a package from the build for later deployment.

This looks like this this in the YAML file:

```xml
## Copy the client to the staging directory
- task: CopyFiles@2
  inputs:
    sourceFolder: '$(buildOutputFolder)' 
    contents: '**/*' 
    targetFolder: '$(Build.ArtifactStagingDirectory)'
    cleanTargetFolder: true

## Archive the files into a zip file for publishing
- task: ArchiveFiles@2
  inputs:
    rootFolderOrFile: $(Build.ArtifactStagingDirectory)
    archiveType: 'zip'
    archiveFile: '$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip'
    includeRootFolder: false

## Publish the zip file
- task: PublishBuildArtifacts@1
  inputs:
    pathtoPublish: '$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip'
```

Notice again how I am using the PowerShell syntax `$(Build.ArtifactStagingDirectory)'` to refer to a variable but this time I am using the predefined `Build.ArtifactStagingDirectory` variable.

## Creating a new build

For more information on how to create a new build pipeline see the documentation [getting started guide](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started-yaml?view=vsts). 

Once you've done that you will just need to copy in the [React Example YAML file](https://github.com/sethreidnz/azure-devops-examples/blob/master/react-pipeline.yml) to your `azure-pipelines.yml` and make sure that the `projectFolder` and `buildOutputFolder` are pointing to your react project.

## Useful resources

- [How to use Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?toc=/azure/devops/pipelines/toc.json&bc=/azure/devops/boards/pipelines/breadcrumb/toc.json&view=vsts)
- [Key concepts of Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?toc=/azure/devops/pipelines/toc.json&bc=/azure/devops/boards/pipelines/breadcrumb/toc.json&view=vsts)
- [Azure Pipelines YAML schema](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=vsts)
- [Catalogue of build in tasks for Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/?view=vsts)