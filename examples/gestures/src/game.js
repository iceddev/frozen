define([
  './update',
  './draw',
  './initInput',
  './handleInput',
  './boxData',
  './Lighthouse',
  './Tavern',
  './Zombie',
  './Girl',
  'frozen/box2d/BoxGame',
  'frozen/box2d/Box',
  'frozen/box2d/entities'
], function(update, draw, initInput, handleInput, boxData, Lighthouse, Tavern, Zombie, Girl, BoxGame, Box, entities){

  'use strict';

  var xZombies = 4;
  var yZombies = 3;
  var zombiesStartX = 400;
  var zombiesStartY = 400;
  var i, j;

  //setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'gameArea',
    canvasPercentage: 0.95,
    update: update,
    draw: draw,
    box: new Box({resolveCollisions: true, gravityY: 0}), //change any box defaults here
    drawables: [],
    creatures: [],
    initInput: initInput,
    handleInput: handleInput
  });

  //add everything to box from the boxData
  for (i = 0; i < boxData.entities.length; i++) {
    var props = boxData.entities[i];
    var Entity = entities[props.type];

    if(Entity){
      game.addBody(new Entity(props));
    }
  }

  game.addBody(new Lighthouse());
  game.drawables.push(game.entities.lighthouse);

  game.addBody(new Tavern());
  game.drawables.push(game.entities.tavern);

  game.addBody(new Girl());
  game.creatures.push(game.entities.girl);
  game.drawables.push(game.entities.girl);

  for (i = 0; i < yZombies; i++) {
    for (j = 0; j < xZombies; j++) {
      var zombie = new Zombie({
        x: zombiesStartX + (j * 40),
        y: zombiesStartY + (i * 40),
        id: 'z_' + i + '_' + j
      });
      game.addBody(zombie);
      game.drawables.push(zombie);
      game.creatures.push(zombie);
    }
  }

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();

});