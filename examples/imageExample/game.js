// load the AMD modules we need
require([
  'frozen/GameCore',
  'dojo/keys',
  // You can use plugins to load your resources
  'frozen/plugins/loadImage!images/background.png',
  'frozen/plugins/loadImage!images/nyan.png'
], function(GameCore, keys, backImg, nyan){

  'use strict';

  var x = 100;
  var y = 100;
  var speed = 2.5;

  // setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    initInput: function(im){ // im = this.inputManager
      // tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
      im.addKeyAction(keys.DOWN_ARROW);
    },
    handleInput: function(im){
      // just an example showing how to check for presses, could be done more effeciently
      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        x-= speed;
      }

      if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        x+= speed;
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        y-= speed;
      }

      if(im.keyActions[keys.DOWN_ARROW].isPressed()){
        y+= speed;
      }
    },
    update: function(millis){
      // no real game state to update in this example
    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      context.drawImage(nyan, x, y);
    }
  });

  // if you want to take a look at the game object in dev tools
  console.log(game);

  // launch the game!
  game.run();
});
