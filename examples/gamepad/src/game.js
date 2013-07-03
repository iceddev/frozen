define([
  './draw',
  './handleInput',
  './Car',
  'lodash',
  'frozen/box2d/Box',
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities',
  './boxData'
], function(draw, handleInput, Car, _, Box, BoxGame, entities, boxData){

  'use strict';

  //setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'gameArea',
    canvasPercentage: 0.95,
    box: new Box({gravityY: 0}),
    draw: draw,
    handleInput: handleInput
  });

  _.forEach(boxData.entities, function(entity){
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