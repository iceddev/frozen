Frozen is an open source HTML5 game engine.
===========================================

[![build status](https://secure.travis-ci.org/iceddev/frozen.png?branch=testing)](http://travis-ci.org/iceddev/frozen)

## Examples

Examples can be found at https://github.com/iceddev/frozen/tree/js2.0/examples

Basic Usage
===========

In your HTML, just add

```html
<script src="dist/frozen.js"></script>
<script src="game.js"></script> <!-- This is your JavaScript file -->
```

### Don't forget to add `dist` from this project to yours!

## Simple game.js

```javascript
// require pulls in the modules you need, such as 'frozen/GameCore'
require(['frozen/GameCore'], function(GameCore){
	// Inside this function, we have access to all modules passed in as parameters
});
```

## GameCore - [Example](https://github.com/iceddev/frozen/tree/js2.0/examples/animation)

```javascript
require(['frozen/GameCore'], function(GameCore){
	// game state
	var x = 0;
	var y = 0;

	//setup a GameCore instance
	var game = new GameCore({
		canvasId: 'canvas',
		draw: function(context){
			context.clearRect(0, 0, this.width, this.height);
			context.fillRect(x, y, 50, 50);
		},
		update: function(millis){
			x += 1;
			y += 1;
		}
	});

	//launch the game!
	game.run();
});
```

## InputManager - [Example](https://github.com/iceddev/frozen/tree/js2.0/examples/input)

```javascript
require(['frozen/GameCore', 'dojo/keys'], function(GameCore, keys){

	var x = 100;
	var y = 100;
	var speed = 2.5;

	//setup a GameCore instance
	var game = new GameCore({
		canvasId: 'canvas',
		draw: function(context){
			context.clearRect(0, 0, this.width, this.height);
			context.fillRect(x, y, 50, 50);
		},
		initInput: function(){
			//tells the input manager to listen for key events
			this.inputManager.addKeyAction(keys.LEFT_ARROW);
			this.inputManager.addKeyAction(keys.RIGHT_ARROW);
			this.inputManager.addKeyAction(keys.UP_ARROW);
			this.inputManager.addKeyAction(keys.DOWN_ARROW);
		},
		update: function(millis){

			//just an example showing how to check for presses, could be done more effeciently

			if(this.inputManager.keyActions[keys.LEFT_ARROW].isPressed()){
				x-= speed;
			}

			if(this.inputManager.keyActions[keys.RIGHT_ARROW].isPressed()){
				x+= speed;
			}

			if(this.inputManager.keyActions[keys.UP_ARROW].isPressed()){
				y-= speed;
			}

			if(this.inputManager.keyActions[keys.DOWN_ARROW].isPressed()){
				y+= speed;
			}
		}
	});

	//launch the game!
	game.run();
});
```

## ResourceManager - [Example](https://github.com/iceddev/frozen/tree/js2.0/examples/imageExample)

```javascript
require(['frozen/GameCore', 'frozen/ResourceManager'], function(GameCore, ResourceManager){

	var x = 0;
	var y = 0;
	var speed = 1;

	//setup a ResourceManager to use in the game
	var rm = new ResourceManager();
	var backImg = rm.loadImage('images/background.png');
	var nyan = rm.loadImage('images/nyan.png');

	//setup a GameCore instance
	var game = new GameCore({
		canvasId: 'canvas',
		resourceManager: rm,
		draw: function(context){
			context.drawImage(backImg, 0, 0, this.width, this.height);
			context.drawImage(nyan, x, y);
		},
		update: function(millis){
			x += speed;
			y += speed;
		}
	});

	//launch the game!
	game.run();
});
```

## Building

Warning: don't run `npm install` unless you need raw source, as this will use volo to install dojo, dojo utils, dcl, and Box2D

If you want to build from source, run:

1. `npm install` to get all the NPM dependencies and start the `volo add`
2. `grunt dojo` to start the dojo build
3. Optionally, `grunt jsdoc` will generate docs

More documentation coming.  Promise :)

## License

The MIT License (MIT)

Copyright (c) 2013 Iced Development, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.