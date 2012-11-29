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








More documentation coming.  Promise :)