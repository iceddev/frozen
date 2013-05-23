define([
  './update',
  './draw',
  './boxData',
  './Lighthouse',
  './Tavern',
  './Zombie',
  './Girl',
  'dojo/keys',
  'frozen/box2d/BoxGame',
  'frozen/box2d/Box',
  'frozen/box2d/entities/Rectangle',
  'frozen/box2d/entities/Circle',
  'frozen/box2d/entities/Polygon',
  'frozen/utils/degreesFromCenter',
  'frozen/utils/scalePoints'
], function(update, draw, boxData, Lighthouse, Tavern, Zombie, Girl, keys, BoxGame, Box, Rectangle, Circle, Polygon, degreesFromCenter, scalePoints){

  'use strict';

  var xZombies = 4;
  var yZombies = 3;
  var zombiesStartX = 400;
  var zombiesStartY = 400;
  var i, j;
  var speed = 10;

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
    handleInput: function(im, millis){
      var position = null;
      if(im.touchAction.isPressed()){
        position = im.touchAction.position;
      }
      else if(im.mouseAction.isPressed()){
        position = im.mouseAction.position;
      }

      if(position){
        var scaledPosition = scalePoints(position, 1 / this.box.scale);
        if(scaledPosition){
          console.log('scaledPosition', scaledPosition);
          for (i = 0; i < this.creatures.length; i++) {
            if(this.creatures[i].girl){
              this.box.applyForceDegrees(this.creatures[i].id, degreesFromCenter(scaledPosition, this.creatures[i]), speed * millis / 50);
            }else{
              this.box.applyForceDegrees(this.creatures[i].id, degreesFromCenter(this.creatures[i], scaledPosition), speed * millis / 100);
            }

          }
        }
      }
    }
  });

  //add everything to box from the boxData
  for (i = 0; i < boxData.entities.length; i++) {
    var obj = boxData.entities[i];
    obj.restitution = 0;
    var ent;
    if(obj.type === 'Rectangle'){
      ent = new Rectangle(obj);
    }
    else if(obj.type === 'Polygon'){
      ent = new Polygon(obj);
    }
    else if(obj.type === 'Circle'){
      ent = new Circle(obj);
    }

    if(ent){
      game.addBody(ent);
    }
  }

  game.addBody(new Lighthouse());
  game.addBody(new Tavern());
  game.drawables.push(game.entities.lighthouse);
  game.drawables.push(game.entities.tavern);

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

  var girl = new Girl();
  game.addBody(girl);
  game.creatures.push(girl);
  game.drawables.push(girl);

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();

});