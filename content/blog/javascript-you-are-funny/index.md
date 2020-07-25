---
title: "JavaScript you are funny - Thoughts and predictions"
description: "Test description"
slug: ""
cover: "https://unsplash.it/1152/300/?random?TheButterflyoftheEdge"
date: "2017-03-17"
topics: 
    - "web-development"
tags:
    - "javascript"
---

I often reflect on my interesting position of being an avid fan of type systems and precompiled production code, while primarily being a JavaScript developer. Especially as the ever changing landscape of the web development world keeps morphing slowly into something that is completely different... But somewhat familiar.

I recently got involved in a discussion on Twitter about Facebook's type checker [Flow](https://flow.org/) and how it could be improved. This kicked off a thread where Daniel Perez Alvarez (@unindented) chimed in making a request for the late comer (Flow) to collaborate more with the more established [TypeScript](https://www.typescriptlang.org/). TypeScript's type system is not only extremely powerful, many library authors have already made great efforts to define the types in their APIs with [Definitely Typed](http://definitelytyped.org/), even if they don't even use TypeScript. Problem is now these same people are having to duplicate work creating Flow definitions too.

<blockquote class="twitter-tweet" data-lang="en">
<p dir="ltr" lang="en">Could also spend some time agreeing with TypeScript team on syntax? The amount of duplicated effort for library/declaration authors is sad.</p>
— Daniel Perez Alvarez (@unindented) <a href="https://twitter.com/unindented/status/885143139123552256">July 12, 2017</a></blockquote>
## What's going on JavaScript?

This brings me to the title of this post and why I think this whole thing is a little bit funny, especially as a fan of C# and other statically typed languages... We've been here before.

### Object oriented?

I remember when the murmur of classes coming to JavaScript started there was a lot of dissidence. I even went to a talk that was decrying the inclusion of such heresy against the [prototype model](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) underpinning the language. JavaScript is JavaScript and we don't need any of this object oriented non-sense.

But now thanks to [Babel](https://babeljs.io) and various libraries like [React](https://facebook.github.io/react/), [Angular](https://angular.io/) and [Ember](https://www.emberjs.com/) they have become accepted parts of the language. Even if it's just syntactic sugar and the implementation is a little flawed (who hasn't had problems with `this` in class?).

### Compiled Vs interpreted?

This brings me to compiled vs interpreted languages, JavaScript being the later. Interestingly a lot of modern JavaScript development is in this weird middle ground where it's accepted as best practice to use a pre-compiler like Babel, or a super set language like Typescript, but your code is still interpreted in the browser. So now front-end projects have build servers and "production" vs "development" builds. Not to mention the imminent arrival of [Web Assembly](http://webassembly.org/) which is literally a compile target for the web.

I could have sworn I've heard many people scorn the complexity and hassle of compiled languages...

### Type systems just get in my way!

Getting back to the Twitter discussion above, I know many people who have said that they "don't believe in type systems" or "it just gets in my way" or "it's too hard for beginners" and various other argument against type systems. But there has been a sea-change in this attitude toward static type checking and in my opinion this is step forward.

Type systems are not only great for avoiding simple errors and reducing the amount of unit testing you need to do as a result, they also serve as a form of "documentation as code". You can read the code and know the shape of data going in and out of functions. You can see what available methods are on objects and classes. If you use a [good text editor](https://code.visualstudio.com/) or IDE you get autocomplete on properties and methods, safer refactoring and type safety warnings. In my opinion adding types to any non-trivial code base is a major win with very little downside.

## Prediction

This brings me to something I've long predicted could happen based on this trend of JavaScript taking the best parts of languages that it's developers love outside of JavaScript. **One day JavaScript will have an optional type system like TypeScript and Flow do**. The creator of JavaScript Brendan Eich gave me some evidence that we are getting closer to this coming true:

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en">
<p dir="ltr" lang="en">TC39 agenda item, based on reserving : after declarator name in declarations.</p>
— BrendanEich (@BrendanEich) <a href="https://twitter.com/BrendanEich/status/885312100767223808">July 13, 2017</a></blockquote>

This is already in fact [in the spec (fifth bullet)](https://www.ecma-international.org/ecma-262/7.0/index.html#sec-forbidden-extensions). What it means is that the browser implementations of JavaScript aren't allowed to extend the language in a way that would get in the way of implementing the type annotation syntax used by both TypeScript and Flow. For example:

``` lang-javascript
function greeter(person: string) {
return "Hello, " + person;
}
```

Where the **type** of the parameter `person` is `string` which is annotated by using the syntax `person: string`.

This means is that TC39 (the committee that decides on the JavaScript spec) have safeguarded against browser vendors making extensions to the language in their implementation that would get in the way of them including a similar syntax in later specifications...

Why do I think this is funny? I swear a few years ago people were bagging on type systems in JavaScript... Maybe I'm just being hopeful but we'll see.

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>