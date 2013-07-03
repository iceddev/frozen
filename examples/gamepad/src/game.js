define([
  './update',
  './draw',
  './handleInput',
  './Car',
  'dojo/keys',
  'frozen/box2d/Box',
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities',
  './boxData'
], function(update, draw, handleInput, Car, keys, Box, BoxGame, entities, boxData){

  'use strict';

  //setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'gameArea',
    canvasPercentage: 0.95,
    box: new Box({gravityY: 0}),
    update: update,
    draw: draw,
    initInput: function(im){
      //just check for support, we'll actually handle gamepad in handleInput()
      this.gamepadSupport = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
      im.addKeyAction(keys.DOWN_ARROW);
    },
    handleInput: handleInput
  });

  boxData.entities.forEach(function(entity){
    if(entity.id === 'car'){
      game.addBody(new Car(entity));
      game.box.setAngle('car', Math.PI * 1.5);
    }else if(entities[entity.type]){
      game.addBody(new entities[entity.type](entity));
    }
  });


  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();

});