//load the AMD modules we need
require([
  'dojo/keys',
  'frozen/Animation',
  'frozen/box2d/Box',
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities/Rectangle',
  'frozen/box2d/entities/Polygon',
  'frozen/box2d/entities/Circle',
  'frozen/utils',
  'frozen/plugins/loadImage!images/background.png',
  'frozen/plugins/loadImage!images/nyan.png',
  'frozen/plugins/loadImage!images/portal_orange_sheet_small.png',
  'frozen/plugins/loadImage!images/portal_blue_sheet_small.png',
  'frozen/plugins/loadSound!sounds/hit.wav',
  'frozen/plugins/loadSound!sounds/whoosh.wav',
  'frozen/plugins/loadSound!sounds/backWhoosh.wav'
], function(keys, Animation, Box, BoxGame, Rectangle, Polygon, Circle, utils, backImg, nyanImg, orangePortalSheet, bluePortalSheet, hit, whoosh, backWhoosh){

  'use strict';

  var speed = 8;

  var portalCollisionDistance = 50;

  var orangePortalAnim = Animation.prototype.createFromSheet(12, 100, orangePortalSheet, 80, 120, 0);
  var orangePortal = {x: 150, y: 100, collided: true};

  var bluePortalAnim = Animation.prototype.createFromSheet(12, 100, bluePortalSheet, 80, 120, 0);
  var bluePortal = {x: 600, y: 100, collided: true};

  //objects in box2d need an id
  var geomId = 1;

  //shapes in the box2 world, locations are their centers
  var nyan, pyramid, ground, ceiling, leftWall, rightWall;

  //setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'container',
    canvasPercentage: 0.95,
    box: new Box({resolveCollisions: true}),
    initInput: function(im){
      //tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
      im.addKeyAction(keys.DOWN_ARROW);
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

      if(im.touchAction.isPressed()){ //mobile first :)
        this.box.applyImpulse(nyan.id, utils.radiansFromCenter({x:nyan.x * this.box.scale, y:nyan.y * this.box.scale},im.touchAction.position), speed / 2);
      }
      else if(im.mouseAction.isPressed()){
        this.box.applyImpulse(nyan.id, utils.radiansFromCenter({x:nyan.x * this.box.scale, y:nyan.y * this.box.scale},im.mouseAction.position), speed / 2);
      }
    },
    update: function(millis){
      //update the animations
      orangePortalAnim.update(millis);
      bluePortalAnim.update(millis);

      //this is for simple distance-based collision detection outside of box2s
      var blueDist = utils.distance({x: nyan.x * this.box.scale, y: nyan.y * this.box.scale}, bluePortal);
      var orangeDist = utils.distance({x: nyan.x * this.box.scale, y: nyan.y * this.box.scale}, orangePortal);

      if(blueDist > portalCollisionDistance){
        bluePortal.collided = false;
      }
      if(orangeDist > portalCollisionDistance){
        orangePortal.collided = false;
      }

      if(orangeDist < portalCollisionDistance && !orangePortal.collided){
        bluePortal.collided = true;
        this.box.setPosition(nyan.id, bluePortal.x / this.box.scale, bluePortal.y / this.box.scale);
        whoosh.play();
      }
      else if(blueDist < portalCollisionDistance && !bluePortal.collided){
        orangePortal.collided = true;
        this.box.setPosition(nyan.id, orangePortal.x / this.box.scale, orangePortal.y / this.box.scale);
        backWhoosh.play();
      }

      // this uses a simple wrapper for box2d's own collision detection
      if(nyan.collisions){
        nyan.collisions.forEach(function(collision){
          if(collision.impulse > 10){
            //console.log('nyan collision impulse:', collision.id , collision.impulse);
            hit.play();
          }
        });
      }
    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      orangePortalAnim.draw(context, orangePortal.x - orangePortalAnim.width / 2, orangePortal.y - orangePortalAnim.height / 2);
      bluePortalAnim.draw(context, bluePortal.x - bluePortalAnim.width / 2, bluePortal.y - bluePortalAnim.height / 2);
      nyan.draw(context);
    }
  });

  //create each of the shapes in the world
  ground = new Rectangle({
    id: geomId,
    x: 385,
    y: 480,
    halfWidth: 1000,
    halfHeight: 40,
    staticBody: true
  });
  game.box.addBody(ground); //add the shape to the box
  game.entities[geomId] = ground; //keep a reference to the shape for fast lookup

  ceiling = new Rectangle({
    id: geomId,
    x: 385,
    y: -200,
    halfWidth: 1000,
    halfHeight: 40,
    staticBody: true
  });
  game.box.addBody(ceiling);
  game.entities[geomId] = ceiling;

  leftWall = new Rectangle({
    id: geomId,
    x: -80,
    y: 240,
    halfWidth: 40,
    halfHeight: 1000,
    staticBody: true
  });
  game.box.addBody(leftWall);
  game.entities[geomId] = leftWall;

  rightWall = new Rectangle({
    id: geomId,
    x: 850,
    y: 240,
    halfWidth: 40,
    halfHeight: 1000,
    staticBody: true
  });
  game.box.addBody(rightWall);
  game.entities[geomId] = rightWall;


  geomId++;
  pyramid = new Polygon({
    id: geomId,
    points: [{x: 320, y: 440}, {x: 446, y: 290}, {x: 565, y: 440}],
    staticBody: true
  });
  game.box.addBody(pyramid);
  game.entities[geomId] = pyramid;

  geomId++;
  nyan = new Rectangle({
    id: 'nyan',
    x: 116,
    y: 360,
    halfWidth: 40,
    halfHeight: 28,
    staticBody: false,
    draw: function(ctx){ // we want to render the nyan cat with an image
      ctx.save();
      ctx.translate(this.x * this.scale, this.y * this.scale);
      ctx.rotate(this.angle); // this angle was given to us by box2d's calculations
      ctx.translate(-(this.x) * this.scale, -(this.y) * this.scale);
      ctx.fillStyle = this.color;
      ctx.drawImage(
        nyanImg,
        (this.x-this.halfWidth) * this.scale - 10, //lets offset it a little to the left
        (this.y-this.halfHeight) * this.scale
      );
      ctx.restore();
    }
  });
  game.box.addBody(nyan);
  game.entities[nyan.id] = nyan;


  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});