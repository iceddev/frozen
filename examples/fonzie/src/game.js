define([
  './draw',
  './Head',
  './entities',
  'lodash/collections/forEach',
  'dojo/keys',
  'frozen/utils/radiansFromCenter',
  'frozen/utils/scalePoints',
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities',
  'frozen/box2d/joints/Revolute'
], function(draw, Head, boxData, forEach, keys, radiansFromCenter, scalePoints, BoxGame, entities, Revolute){

  'use strict';

  var speed = 10;

  //setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'gameArea',
    canvasPercentage: 0.95,
    height: 600,
    width: 1000,
    draw: draw,
    initInput: function(im){
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
      im.addKeyAction(keys.DOWN_ARROW);

      im.addKeyAction('A');
      im.addKeyAction('D');
    },
    handleInput: function(im){
      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        this.box.applyImpulseDegrees('torso', 270, speed);
      }

      if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        this.box.applyImpulseDegrees('torso', 90, speed);
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        this.box.applyImpulseDegrees('torso', 0, speed);
      }

      if(im.keyActions.A.isPressed()){
        this.box.applyTorque('torso', -speed * 100);
      }

      if(im.keyActions.D.isPressed()){
        this.box.applyTorque('torso', speed  * 100);
      }

      if(im.mouseAction.isPressed()){
        this.box.applyImpulse('torso', radiansFromCenter(this.entities.torso, scalePoints(im.mouseAction.position, 1/this.box.scale)), speed);
      }
    }
  });

  //add everything to box from the boxData
  forEach(boxData.entities, function(props){
    if(props.id === 'head'){
      game.addBody(new Head(props));
    } else {
      var Entity = entities[props.type];

      if(Entity){
        game.addBody(new Entity(props));
      }
    }
  });

  forEach(boxData.joints, function(props){
    var joint;
    if(props.type === 'Revolute'){
      joint = new Revolute(props);
    }

    if(joint){
      game.box.addJoint(joint);
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();

});
