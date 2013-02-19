Frozen <sup>v0.2.0</sup>
========================
[![build status](https://secure.travis-ci.org/iceddev/frozen.png?branch=0.2.0)](http://travis-ci.org/iceddev/frozen)

## What is Frozen?

Frozen is an open-source HTML5 game engine delivering ease-of-use, rapid development through tooling and modularity.

Our goal is to apply techniques used in building modern webapps to game development, such as AMD modules, dependency management, build process, and project scaffolding.

## Get Frozen

* Frozen (single file - AMD loader included)<br>
[Development](https://raw.github.com/iceddev/frozen/master/dist/frozen.js.uncompressed.js) and
[Production](https://raw.github.com/iceddev/frozen/master/dist/frozen.js)

* Frozen Source (individual modules - bring your own loader or use Dojo)<br>
Use `volo add iceddev/frozen` to add it to your project<br>
or grab the zip: [Frozen Source](https://github.com/iceddev/frozen/archive/master.zip) (but don't forget your dependencies)

* Or just use the boilerplate!<br>
Use `volo create your_project iceddev/frozen-dev-boilerplate` which will scaffold out a new project for you and install all dependencies

## Documentation

Documentation is available at http://iceddev.github.com/frozen/

## Examples

Play examples at http://iceddev.github.com/frozen/examples<br>
Examples source code can be found at https://github.com/iceddev/frozen/tree/master/examples

## Browser Support

We have tested in:

* Chrome 24 & 26-dev
* Firefox 18
* IE10 (limitated sound support)
* Chrome for Android 18 & 24 (no sound support)
* Firefox for Android 18-19 & 20a2
* PhantomJS 1.8.1

__Most modern browsers should support this game engine if they support canvas, but YMMV with sounds__

## Development

__Warning: don't run `npm install` unless you need raw source, as this will use volo to install dojo, dojo utils, dcl, and Box2D__

### Dependencies

All development tasks depend on having dependencies installed.

Use `npm install` to get all the NPM dependencies and start the `volo add`

### Building the dist/frozen layer

`grunt dojo` to start the dojo build

### Generating the docs

`grunt jsdoc` will generate docs

### Running the tests

`grunt jasmine` to run tests in PhantomJS or `grunt jasmine-server` to run tests in the browser

### Linting the source

`grunt lint` to lint the source

### Linting and running tests when files change

`grunt watch` to watch the source and specs and run lint and jasmine when a file changes

## License

The MIT License (MIT)

Copyright (c) 2013 Iced Development, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.