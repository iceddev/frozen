Frozen is an open source HTML5 game engine.
===========================================

[![build status](https://secure.travis-ci.org/iceddev/frozen.png?branch=0.2.0)](http://travis-ci.org/iceddev/frozen)

## Examples

Examples can be found at https://github.com/iceddev/frozen/tree/master/examples

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