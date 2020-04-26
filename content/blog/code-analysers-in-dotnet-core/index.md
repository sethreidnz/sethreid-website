---
title: "How to setup code analysis/linting for .NET (with Roslyn analyzers)"
description: "Test description"
slug: "code-analyzers-in-dotnet-core"
cover: "https://unsplash.it/1152/300/?random?BirchintheRoses"
date: "2017-12-03"
topics:
    - "web-development"
tags:
    - ".NET Core"
---

I'm a huge fan of coding standards, but I'm not a big fan of having to enforce them myself. This article is here to show you how to setup automatic code analysis using the new Rosyln anaysers and the ports of the classic StyleCop rule sets. If you want to see a basic .NET application with all this setup then you can [find it here](https://github.com/sethreidnz/dotnet-code-analysis).

> *NOTE:* This will work with both Visual Studio and Visual Studio code, although I haven't been able to figure out how to get live analysis in Visual Studio code yet... But it still works on building the project

As a team of people working on software the easiest thing to do is to come up with a reasonable set of standards and use your build tools to enforce it. That way code reviewers don't have to waste time nit-picking and everyone can be happy that the code and style is consistent.

That is where style rules and code analysis comes in. Historically when using .NET you could use the 300+ rules shipped as part of *FxCop* (FxCop is an application that analyses managed code assemblies. Don't worry if you don't know what this is as they freely admit "to many people 'FxCop' means nothing"). But as explained [here](https://github.com/dotnet/roslyn-analyzers/blob/master/docs/FxCopPort/Porting%20FxCop%20Rules%20to%20Roslyn.md) with the release of the new [open source Roslyn compiler](https://github.com/dotnet/roslyn) the team have ported much of what is useful from FxCop into individual packages that you can consume from your application, including in .NET Core.

## What do you get?

In a nutshell you can install a few packages to your project and automatically get live analysis and build time analysis to tell you and your team if they are breaking set guidelines.

Having ported a lot of the style rules from the old StyleCop way of doing things they have made other really useful improvements which mean:

- A significantly tightened set of rules, removing many obsolete ones, and adding new ones for things such as `async` and `ImmutableCollections`.
- Live analysis as you type in Visual Studio.
- Roslyn based analysers can ship with 'fixers' meaning, where possible you can use the context menu to automatically fix errors instead of manually fixing them.
- Rules that are specific to an APIs will reside in packages that ship with the API automatically, meaning you don't have to find and download it yourself.
- Rules that don't relate to a specific API, but are more general guidelines are now grouped by the purpose they serve. For example, some rules might help API authors produce consistent public APIs, but those rules might not make sense for test assemblies.

## How to set it up

I'm going to focus on how you would set up a .NET core project, but this would be the same for .NET framework in https://sethreid.co.nz/wp/wp-admin/themes.phpprinciple except some of the details about how to install packages might be a little different.

The first thing you need to do to get the basic style rules added is add the following packages to your .csproj file (or install them through the Nuget Package Manager):

```
  <DotNetCliToolReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Tools" Version="2.0.1" />
  <PackageReference Include="Microsoft.CodeAnalysis.FxCopAnalyzers" Version="1.1.0" />
  <PackageReference Include="StyleCop.Analyzers" Version="1.0.2" />
  <PackageReference Include="System.Runtime.Analyzers" Version="1.1.0" />
  <PackageReference Include="System.Runtime.InteropServices.Analyzers" Version="1.1.0" />
  <PackageReference Include="System.Security.Cryptography.Hashing.Algorithms.Analyzers" Version="1.1.0" />
  <PackageReference Include="Desktop.Analyzers" Version="1.1.0" />
```

This might seem like a lot of packages but as mentioned earlier all the rules are split up into packages for APIs they relate to. This set is pretty basic and I would start with these and see what rules you don't like and you can disable them.

If you loaded up a .NET WebAPI project with these installed you'd probably start seeing squigly lines like this:

<a href="http://sethreid.co.nz/how-to-setup-code-analysis-dotnet/warningswithanalyser/" rel="attachment wp-att-352"><img class="alignnone size-large wp-image-352" src="https://sethreid.co.nz/content/uploads/2017/12/WarningsWithAnalyser-1024x461.png" alt="Warnings With Analyser" width="1024" height="461" /></a>

This particular rule I don't like and now I can show you how to disable rules using a rule set.

## Disabling rules and treating warnings as build errors

To disable rules you need to create a `.ruleset` file and reference it in your `.csproj` file. A Ruleset file is just a specific XML file that lets to determine which rules from which analyser sets you want to disable or modify. For example here is one I use:

``` xml
<?xml version="1.0" encoding="utf-8"?>
<RuleSet Name="SmartRetail" Description=" " ToolsVersion="10.0">
  <Rules AnalyzerId="StyleCop.Analyzers" RuleNamespace="StyleCop.Analyzers">
    <Rule Id="SA1101" Action="None" />
    <Rule Id="SA1133" Action="None" />
    <Rule Id="SA1200" Action="None" />
    <Rule Id="SA1309" Action="None" />
    <Rule Id="SA1402" Action="None" />
    <Rule Id="SA1611" Action="None" />
    <Rule Id="SA1615" Action="None" />
    <Rule Id="SA1633" Action="None" />
    <Rule Id="SA1649" Action="None" />
    <Rule Id="SA1652" Action="None" />
  </Rules>
  <Rules AnalyzerId="Microsoft.Usage" RuleNamespace="Microsoft.Usage">
    <Rule Id="CA2235" Action="None" />
  </Rules>
</RuleSet>
```

Unforunatley the rules don't have nice names but you can see the code in the warning in Visual Studio as in the above screen capture. For example the rule i above `SA1200` I have disabled by adding the line `` to the `StyleCop.Analyzers` section.

Now to use this you can add a new PropertyGroup element to your projects `.csproj` file like this:

``` xml
<PropertyGroup>
    <TreatWarningsAsErrors>True</TreatWarningsAsErrors>
    <TreatSpecificWarningsAsErrors />
    <CodeAnalysisRuleSet>..\DotnetCodeAnalysis.ruleset</CodeAnalysisRuleSet>
 </PropertyGroup>
```

The above code is first defining where to find your <code>.ruleset</code> file and then there are two lines that are needed to tell the compiler to treat any style warnings as errors, which will break the build.

That is all you need to get going with some basic code analysis on your .NET project! This also works using Visual Studio

## Automatically fixing issues

Just to highlight how useful this is here is a screenshot of how you can not only catch the errors, but in most cases you can let Visual Studio automatically fix them for you too!

<a href="http://sethreid.co.nz/how-to-setup-code-analysis-dotnet/fixerrorautomatically/" rel="attachment wp-att-353"><img class="alignnone size-large wp-image-353" src="https://sethreid.co.nz/content/uploads/2017/12/FixErrorAutomatically-1024x285.png" alt="Fix Error Automatically" width="1024" height="285" /></a>

You can just click on the option to fix the error and you're done!

## Example application

I've created a [sample application](https://github.com/sethreidnz/dotnet-code-analysis) that you can look at to see the full setup described.

[Dotnet Code Analysis Sample](https://github.com/sethreidnz/dotnet-code-analysis)