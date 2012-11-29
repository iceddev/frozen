Frozen is an open source HTML5 game engine.
===========================================

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


More documentation coming.  Promise :)