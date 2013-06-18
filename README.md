![FrozenJS Logo](https://secure.gravatar.com/avatar/272e5230cf45370ed751878105330f3c?s=200)
Frozen <sup>v0.4.0</sup>
========================
[![build status](https://secure.travis-ci.org/iceddev/frozen.png?branch=master)](http://travis-ci.org/iceddev/frozen)

## What is Frozen?

Frozen is an open-source HTML5 game engine delivering ease-of-use, rapid development through tooling and modularity.

Our goal is to apply techniques used in building modern webapps to game development, such as AMD modules, dependency management, build process, and project scaffolding.

## Get Frozen

* Frozen (single file - AMD loader included)<br>
[Development](https://raw.github.com/iceddev/frozen/master/dist/frozen.js.uncompressed.js) and
[Production](https://raw.github.com/iceddev/frozen/master/dist/frozen.js)

* Frozen Source (individual modules - bring your own loader or use Dojo)<br>
Use `volo add iceddev/frozen` to add it to your project<br>
or grab the zip: [Frozen Source](https://github.com/iceddev/frozen/archive/master.zip) (but don't forget your dependencies)<br>
_Note: We supply a jam package and specify dependencies. Although these should work for game creation using the engine, frozen cannot be built or run with jam deps only_

* Or just use the boilerplate!<br>
Use `volo create your_project frozenjs/boilerplate` which will scaffold out a new project for you and install all dependencies

## Documentation

Documentation is available at http://frozenjs.com/docs/

## Examples

Play examples at http://frozenjs.com/examples/<br>
Examples source code can be found at https://github.com/iceddev/frozen/tree/master/examples

## Source

Source available on github: https://github.com/iceddev/frozen

## Browser Support

We have tested in:

* Chrome 27 & 29-canary
* Firefox 21, Aurora 23.0a2 & Nightly 24.0a1
* IE10 (sound with supported codecs)
* Safari 6.0.3
* Chrome for Android 27 & Beta 28 (limited sound support) - Suggestion: in `chrome://flags`, turn on "Disable gesture requirement for media playback" & "Enable WebAudio"
* Firefox for Android 21, Beta 22, Aurora 23.0a2 & Nightly 24.0a1 (Doesn't load some Box2d examples - unsure why)
* PhantomJS 1.9.1

__Most modern browsers should support this game engine if they support requestAnimationFrame or canvas, but YMMV with sounds__

## Rapid Development Through Tooling

Our Frozen Box2d Editor is available at http://phated.github.com/frozen-editor/

## Technologies behind Frozen

While builds of Frozen may be tiny, we use some libraries and technologies behind the scenes as to not reinvent the wheel.

These technologies include:

* [Node.js](http://nodejs.org/) and [npm](https://npmjs.org/) - used for dependecy mangement for our build process and development workflow
* [Grunt](http://gruntjs.com/) - task runner for our development workflow, and allows for a single entry point into development configuration
* [Volo](http://volojs.org/) - clientside dependency management and project scaffolding tool
* [Lo-Dash](http://lodash.com/) - low-level utility library used inside the library
* [Hammer.js](http://eightmedia.github.io/hammer.js/) - multi-touch library used for mouse/touch/pointer event normalization and gestures
* [dcl](http://www.dcljs.org/) - used for generating constructors and supplying AOP convenience methods
* [Box2d](https://box2dweb.googlecode.com/) - used for physics calculations in games
* [Dojo](http://dojotoolkit.org/) - used for AMD loader and some utility modules inside the library, Dojo build process is used to build a single JS file
* [JSDoc](http://usejsdoc.org/) - generates documentation for code
* [Jasmine](http://pivotal.github.com/jasmine/) - tests all use Jasmine
* [AMD](http://requirejs.org/docs/whyamd.html) - all modules are written with AMD and the single layer includes an AMD module loader

## Development

### Dependencies

All development tasks depend on having dependencies installed.

Use `npm install` to get all the build process dependencies
Use `volo add` to get all the library dependencies

### Building the dist/frozen layer

`grunt build` to lint, test, doc, and run dojo build process to build the single layer

### Generating the docs

`grunt docs` will lint and generate docs

### Running the tests

`grunt test` to lint, run tests in PhantomJS and open your default browser at the test URL

### Linting the project

`grunt jshint:all` to lint the project

### Building when files change

`grunt watch:all` to execute `grunt build` whenever a file changes

## Release Notes

### <sup>v0.4.0</sup>

__Breaking Changes__

* Due to performance reasons, `InputManager.mousemove` only fires during `mousedown` or `touchstart` - see [breakouts example](examples/breakouts/src/initInput.js) for workaround
* Added `frozen/TouchAction` instead of using `frozen/MouseAction` - used when `InputManager.emulateMouse` is `false`
* `InputManager.handleTouch` and `InputManager.handleMouse` removed, replaced with `InputManager.emulateMouse` which determines if MouseAction or TouchAction should be used
* Either `InputManager.mouseAction` or `InputManager.touchAction` will be active at one time (depending on state of `InputManager.emulateMouse`)
* `InputManager` event handling methods no longer check if a point is inside canvas
* `InputManager.keyActions` switched from array to object (only breaking if you iterate over the collection)
* Removed `Box.destroyJoint` because it was deprecated in last release
* Created a `frozen/box2d/listeners/Contact` module to contain contact listener callbacks and other logic - move custom contact handlers to this object
* Remove `dojo/dom`, `dojo/dom-geometry` and `dojo/dom-style` modules from hard dependencies to use straight DOM instead (modules will be missing from built layer)
* Remove `dojo/_base/lang` in favor of Lo-Dash (module will be missing from built layer)
* Removed `update` function from `frozen/reiner/Creature` - replaced with `updateDirection` and `updateAnimations` functions

__New Features__

* Add Bower support
* Add dependencies on Lo-Dash and Hammer.js
* Touch/Mouse/Pointer event normalization with Hammer.js
* Gesture support with Hammer.js
* `InputManager.hammer` is an instance of Hammer.js
* `InputManager.on` can be used for binding new events
* `InputManager.insideCanvas` can be used to check a point against the `InputManager`'s `canvas`
* New methods for adding or removing multiple bodies or joints in `frozen/BoxGame`: `addBodies`, `removeBodies`, `addJoints`, `removeJoints`
* New methods for flipping images in `frozen/ResourceManager`: `flipImage`, `flipImageX`, `flipImageY`
* Added `preSolve` to contact listener
* Added box2d sprite, gesture, ragdoll physics, and breakouts examples

__Non-Breaking Changes__

* Update Examples to use features of 0.3.0/0.4.0
* `frozen/utils/removeExtension` now uses a regex for removing the extensions, limited to 4 characters after the `.`
* `require.toUrl(filename)` is now used inside the `loadSound` and `loadImage` functions, instead of the plugins
* Fix for WebAudio on iOS
* On mobile which requires touch, interally switch to `Audio.play()` instead of `Audio.load()` to avoid double loading
* Use `dcl`'s `advice.before` to wire up `GameCore.beforeUpdate`

__Deprecations__

* `GameCore.preUpdate` - Deprecated in favor of beforeUpdate
* `InputManager.handleMouse` (already removed) - Mouse is always handled, use emulateMouse to specify how to handle it
* `InputManager.handleTouch` (already removed) - Touch is always handled, use emulateMouse to specify how to handle it
* `InputManager.mouseUp` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.mouseDown` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.mouseMove` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.touchStart` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.touchEnd` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.touchMove` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.keyPressed` - Use keydown instead - same syntax as normal event handling
* `InputManager.keyDown` - Use the lowercase name instead - same syntax as normal event handling
* `InputManager.keyReleased` - Use keyup instead - same syntax as normal event handling
* `InputManager.getMouseLoc` - Deprecated in favor of normalizePoint function (Same functionality, different name)

### <sup>v0.3.0</sup>

__Breaking Changes__

* Removed previously deprecated methods and properties
* Removed Node 0.6 support for the build process
* `frozen/sounds/Sound` was a plugin, but is now the base object of other Sounds and `frozen/sounds/AudioBase` was removed
* `frozen/sounds/Sound` plugin was moved to `frozen/plugins/sound`
* `frozen/box2d/Entity` moved to `frozen/box2d/entities/Entity`
* `frozen/box2d/RectangleEntity` moved to `frozen/box2d/entities/Rectangle`
* `frozen/box2d/CircleEntity` moved to `frozen/box2d/entities/Circle`
* `frozen/box2d/PolygonEntity` moved to `frozen/box2d/entities/Polygon`
* `frozen/box2d/MultiPolygonEntity` moved to `frozen/box2d/entities/MultiPolygon`

__New Features__

* Auto-selection of Audio extension if no extension is specified
* `loadSound` and `loadImage` plugins now use `require.toUrl()` to generate a path to your resources
* Added `.jamignore` file
* `Box.setAngularVelocity` function added to set the angular velocity on an entity
* Tests added for Sounds, BoxGame, and Sprite
* Added `frozen/box2d/entities` which returns a map of entity types
* Added `frozen/box2d/joints` which returns a map of joint types
* `BoxGame.addBody`, `BoxGame.removeBody`, `BoxGame.addJoint`, `BoxGame.removeJoint` methods added for convenience

__Non-Breaking Changes__

* Made all the examples adhere to the linting rules of the rest of the project
* Move linting declarations to .jshintrc to allow for JSHint being run in the directory standalone
* Update Grunt to `~0.4.1` and add/update all the dependencies in `package.json`
* Modified the Gruntfile to work with new plugins and define more tasks for convenience
* Removed Node 0.6 from tested environments
* Updated examples that were using deprecated methods
* Cleanup event handler usage on Audio implementations
* Rearranged the `specs/` file structure to match `src/`
* Implement the dcl Cleanup API for InputManager to remove event handlers on destruction
* Add declaredClass to entities and joints

__Deprecations__

* `Box.destroyJoint` has been deprecated in favor of `Box.removeJoint`

Full changelog available: [Changelog](https://github.com/iceddev/frozen/wiki/Changelog)

## License

The MIT License (MIT)

Copyright (c) 2013 Iced Development, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.