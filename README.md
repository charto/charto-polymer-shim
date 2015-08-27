charto-polymer-shim
===================

This is a shim for loading Web Components through SystemJS. [systemjs-plugin-html](https://github.com/Hypercubed/systemjs-plugin-html/) imports [webcomponents.js](http://webcomponents.org/polyfills/) asynchronously so if it's used to import Polymer, both load in parallel. Then when the `WebComponentsReady` event gets fired, Polymer may or may not be around yet to catch it.

This shim loads webcomponents.js first and catches the event. Then it imports HTML files sequentially and in parallel so all dependencies for a given import can be loaded before the import itself. When everything is done, the shim dispatches the event again, so Polymer and all other components know they should show themselves.

The only exposed function is `loadMainComponents`. Its parameter is a list of things to load sequentially. Each thing can be a string passed to `System.import` or a list of strings, in which case they're imported in parallel. Only after all parallel imports are ready, `loadMainComponents` moves on to the next sequential thing.

As an added bonus, there's a file `hide.css` which hides a `body` tag with the `unresolved` attribute, like `<body unresolved>`. Polymer will hide it while loading and removes the attribute to show content only when it's initialized. However if Polymer is imported using SystemJS, the content will be visible while Polymer's stylesheets are still loading. Including `hide.css` in the page fixes that.

Example
-------

This is from the article [Taming Polymer with SystemJS and TypeScript, part 1](http://blog.charto.net/typescript/Taming-Polymer-with-SystemJS-and-TypeScript-part-1/).

```javascript
loadMainComponents([
	[
		'bower_components/polymer/polymer.html!',
		'bower_components/polymer-ts/polymer-ts.html!'
	],
	'app'
]);
```

License
-------

[The MIT License](https://raw.githubusercontent.com/charto/charto-polymer-shim/master/LICENSE)

Copyright (c) 2015 BusFaster Ltd
