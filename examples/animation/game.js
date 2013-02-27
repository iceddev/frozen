//load the AMD modules we need
require([
  'frozen/GameCore'
], function(GameCore){

  'use strict';

  // game state
  var x = 0;
  var y = 0;

  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    update: function(millis){
      x += 1;
      y += 1;
    },
    draw: function(context){
      context.clearRect(0, 0, this.width, this.height);
      context.fillRect(x, y, 50, 50);
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});