define([
  'lodash',
  './update',
  './draw',
  './handleInput',
  './boxData',
  './Lighthouse',
  './Tavern',
  './Zombie',
  './Girl',
  'frozen/box2d/BoxGame',
  'frozen/box2d/Box',
  'frozen/box2d/entities'
], function(_, update, draw, handleInput, boxData, Lighthouse, Tavern, Zombie, Girl, BoxGame, Box, entities){

  'use strict';

  var xZombies = 4;
  var yZombies = 3;
  var zombiesStartX = 400;
  var zombiesStartY = 400;
  var i, j;

  // setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'container',
    canvasPercentage: 0.95,
    update: update,
    draw: draw,
    box: new Box({resolveCollisions: true, gravityY: 0}), // change any box defaults here
    drawables: [],
    creatures: [],
    handleInput: handleInput
  });

  // add everything to box from the boxData
  _.forEach(boxData.entities, function(props){
    var Entity = entities[props.type];

    if(Entity){
      game.addBody(new Entity(props));
    }
  });

  game.addBodies(new Girl(), new Lighthouse(), new Tavern());
  game.creatures.push(game.entities.girl);
  game.drawables.push(game.entities.lighthouse);
  game.drawables.push(game.entities.tavern);
  game.drawables.push(game.entities.girl);

  _.times(yZombies, function(i){
    _.times(xZombies, function(j){
      var zombie = new Zombie({
        x: zombiesStartX + (j * 40),
        y: zombiesStartY + (i * 40),
        id: 'z_' + i + '_' + j
      });
      game.addBody(zombie);
      game.drawables.push(zombie);
      game.creatures.push(zombie);
    });
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();

});
