//load the AMD modules we need
require([
  'lodash',
  'dojo/keys',
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities/Rectangle',
  'frozen/box2d/entities/Polygon',
  'frozen/box2d/entities/Circle',
  'frozen/plugins/loadImage!images/background.png',
  'frozen/plugins/loadImage!images/nyan.png',
  'frozen/plugins/loadImage!images/yarn.png'
], function(_, keys, BoxGame, Rectangle, Polygon, Circle, backImg, nyanImg, yarnImg){

  'use strict';

  // create each of the shapes
  var ground = new Rectangle({
    id: _.uniqueId(), // objects in box2d need an id
    x: 385,
    y: 480,
    halfWidth: 1000,
    halfHeight: 40,
    staticBody: true
  });

  var ceiling = new Rectangle({
    id: _.uniqueId(), // objects in box2d need an id
    x: 385,
    y: -200,
    halfWidth: 1000,
    halfHeight: 40,
    staticBody: true
  });

  var leftWall = new Rectangle({
    id: _.uniqueId(), // objects in box2d need an id
    x: -80,
    y: 240,
    halfWidth: 40,
    halfHeight: 1000,
    staticBody: true
  });

  var rightWall = new Rectangle({
    id: _.uniqueId(), // objects in box2d need an id
    x: 850,
    y: 240,
    halfWidth: 40,
    halfHeight: 1000,
    staticBody: true
  });

  var moon = new Circle({
    id: _.uniqueId(), // objects in box2d need an id
    x: 626,
    y: 120,
    radius: 63,
    staticBody: true
  });

  var pyramid = new Polygon({
    id: _.uniqueId(), // objects in box2d need an id
    points: [{x: 320, y: 440}, {x: 446, y: 290}, {x: 565, y: 440}],
    staticBody: true
  });

  var nyan = new Rectangle({
    id: 'nyan',
    x: 116,
    y: 360,
    halfWidth: 40,
    halfHeight: 28,
    staticBody: false,
    draw: function(ctx){ // we want to render the nyan cat with an image
      // standard 2d canvas stuff
      ctx.save();
      ctx.translate(this.x * this.scale, this.y * this.scale); // this.scale because Box2D requires scaled entities
      ctx.rotate(this.angle); // this angle was given to us by box2d's calculations
      ctx.translate(-(this.x) * this.scale, -(this.y) * this.scale); // this.scale because Box2D requires scaled entities
      ctx.drawImage(
        nyanImg,
        (this.x - this.halfWidth) * this.scale - 10, // this.scale because Box2D requires scaled entities
        (this.y - this.halfHeight) * this.scale // this.scale because Box2D requires scaled entities
      );
      ctx.restore();
    }
  });

  var yarn = new Circle({
    id: 'yarn',
    x: 600,
    y: 390,
    radius: 30,
    staticBody: false,
    density: 0.5,  // al little lighter
    restitution: 0.8, // a little bouncier
    draw: function(ctx){  //we also want to render the yarn with an image
      // standard 2d canvas stuff
      ctx.save();
      ctx.translate(this.x * this.scale, this.y * this.scale); // this.scale because Box2D requires scaled entities
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * this.scale, -(this.y) * this.scale); // this.scale because Box2D requires scaled entities
      ctx.drawImage(
        yarnImg,
        (this.x - this.radius) * this.scale, // this.scale because Box2D requires scaled entities
        (this.y - this.radius) * this.scale // this.scale because Box2D requires scaled entities
      );
      ctx.restore();
    }
  });

  var speed = 8;

  // setup a BoxGame instance
  var game = new BoxGame({
    canvasId: 'canvas',
    initInput: function(im){
      // tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);

      im.addKeyAction('A');
      im.addKeyAction('D');
    },
    handleInput: function(im){
      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        this.box.applyImpulseDegrees(nyan.id, 270, speed);
      }

      if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        this.box.applyImpulseDegrees(nyan.id, 90, speed);
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        this.box.applyImpulseDegrees(nyan.id, 0, speed);
      }

      if(im.keyActions.A.isPressed()){
        this.box.applyTorque(yarn.id, -speed);
      }

      if(im.keyActions.D.isPressed()){
        this.box.applyTorque(yarn.id, speed);
      }
    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      nyan.draw(context);
      yarn.draw(context);
    }
  });

  // add the entities to the box
  game.addBodies(ground, ceiling, leftWall, rightWall, moon, pyramid, nyan, yarn);

  // if you want to take a look at the game object in dev tools
  console.log(game);

  // launch the game!
  game.run();
});
