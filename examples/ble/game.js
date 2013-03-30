//load the AMD modules we need
require([
  'frozen/GameCore',
  'dojo/keys'
], function(GameCore, keys){

  'use strict';

  var x = 100;
  var y = 100;
  var speed = 2.5;

  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    initInput: function(im){ // im = this.inputManager

      //tells the input manager to listen for key events
      im.addKeyAction(4);
      im.addKeyAction(6);
      im.addKeyAction(2);
      im.addKeyAction(8);
    },
    handleInput: function(im){

      //just an example showing how to check for presses, could be done more effeciently

      if(im.keyActions[4].isPressed()){
        x-= speed;
      }

      if(im.keyActions[6].isPressed()){
        x+= speed;
      }

      if(im.keyActions[2].isPressed()){
        y-= speed;
      }

      if(im.keyActions[8].isPressed()){
        y+= speed;
      }
    },
    update: function(millis){
      //no real game state update in this example
    },
    draw: function(context){
      context.clearRect(0, 0, this.width, this.height);
      context.fillRect(x, y, 50, 50);
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);


  var socket = eio('ws://' + window.location.hostname + ':8080');
  socket.on('open', function(){
    socket.on('message', function(data){
      console.log(data);
      for(var key in game.inputManager.keyActions){
        game.inputManager.keyActions[key].release();
      }
      if(game.inputManager.keyActions[data]){
        game.inputManager.keyActions[data].press();
      }
    });
    // socket.olosnce = function(){};
  });

  //launch the game!
  game.run();
});