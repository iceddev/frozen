![FrozenJS Logo](https://secure.gravatar.com/avatar/272e5230cf45370ed751878105330f3c?s=200)
Frozen <sup>v0.8.0</sup>
========================
[![build status](https://secure.travis-ci.org/iceddev/frozen.png?branch=master)](http://travis-ci.org/iceddev/frozen)

## What is Frozen?

Frozen is an open-source HTML5 game engine delivering ease-of-use, rapid development through tooling and modularity.

Our goal is to apply techniques used in building modern webapps to game development, such as ES next, dependency management, build process, and project scaffolding.

## Get Frozen

* Frozen (single file - global frozenjs)<br>
[Development](https://unpkg.com/frozenjs@0.5.3/dist/frozen.bundle.js) and
[Production](https://unpkg.com/frozenjs@0.5.3/dist/frozen.bundle.min.js)

* Frozen Source (individual modules)<br>
Use `npm i frozenjs` to add it to your project<br>



## Examples

Play examples at https://frozen-demos.netlify.com/<br>
Examples source code can be found at https://github.com/iceddev/frozen-examples

## Source

Source available on github: https://github.com/iceddev/frozen

## Rapid Development Through Tooling

Our Frozen Box2d Editor is available at http://phated.github.com/frozen-editor/

## Technologies behind Frozen

While builds of Frozen may be tiny, we use some libraries and technologies behind the scenes as to not reinvent the wheel.

These technologies include:

* [Node.js](http://nodejs.org/) and [npm](https://npmjs.org/) - used for dependecy mangement for our build process and development workflow
* [Hammer.js](http://eightmedia.github.io/hammer.js/) - multi-touch library used for mouse/touch/pointer event normalization and gestures
* [Box2d](https://box2dweb.googlecode.com/) - used for physics calculations in games
* [JSDoc](http://usejsdoc.org/) - generates documentation for code



### Building the dist/frozen layer

`npm run build` to lint, test, doc, and run webpack build process to build the single file

### Generating the docs

`npm run doc` will lint and generate docs

### Running the tests

`npm run test` to lint, run tests in PhantomJS and open your default browser at the test URL


## Release Notes

### <sup>v0.5.3</sup>

__Breaking Changes__

* ES.next re-write

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

Copyright (c) 2018 Iced Development, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
