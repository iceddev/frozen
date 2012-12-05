//load the AMD modules we need
require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys', 'dojo/_base/declare', 'frozen/Animation', 'frozen/box2d/Box', 'frozen/box2d/RectangleEntity', 'frozen/box2d/PolygonEntity', 'frozen/box2d/CircleEntity', 'frozen/utils'],
 function(GameCore, ResourceManager, keys, declare, Animation, Box, Rectangle, Polygon, Circle, utils){

  //dimensions same as canvas.
  var gameH = 480;
  var gameW = 770;
  
  var speed = 8;
  
  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/background.png');
  var nyanImg = rm.loadImage('images/nyan.png');
  var hit = rm.loadSound('sounds/hit.wav');
  var whoosh = rm.loadSound('sounds/whoosh.wav');
  var backWhoosh = rm.loadSound('sounds/backWhoosh.wav');

  var portalCollisionDistance = 50;
  var animFactory = new Animation();

  var orangePortalSheet = rm.loadImage('images/portal_orange_sheet_small.png');
  var orangePortalAnim = animFactory.createFromTile(12, 100, orangePortalSheet, 120, 80, 0);
  var orangePortal = {x: 150, y: 100, collided: true};

  var bluePortalSheet = rm.loadImage('images/portal_blue_sheet_small.png');
  var bluePortalAnim = animFactory.createFromTile(12, 100, bluePortalSheet, 120, 80, 0);
  var bluePortal = {x: 600, y: 100, collided: true};
  
  var box;
  var world = {};

  //pixels per meter for box2d
  var SCALE = 30.0;

  //objects in box2d need an id
  var geomId = 1;

  //shapes in the box2 world, locations are their centers
  var nyan, pyramid, ground, ceiling, leftWall, rightWall;

 
  // create our box2d instance
  box = new Box({intervalRate:60, adaptive:false, width:gameW, height:gameH, scale:SCALE, gravityY:9.8, resolveCollisions: true});

  //create each of the shapes in the world
  ground = new Rectangle({
    id: geomId,
    x: 385 / SCALE,
    y: 480 / SCALE,
    halfWidth: 1000 / SCALE,
    halfHeight: 40 / SCALE,
    staticBody: true
  });
  box.addBody(ground); //add the shape to the box
  world[geomId] = ground; //keep a reference to the shape for fast lookup

  celing = new Rectangle({
    id: geomId,
    x: 385 / SCALE,
    y: -200 / SCALE,
    halfWidth: 1000 / SCALE,
    halfHeight: 40 / SCALE,
    staticBody: true
  });
  box.addBody(celing);
  world[geomId] = celing;

  leftWall = new Rectangle({
    id: geomId,
    x: -80 / SCALE,
    y: 240 / SCALE,
    halfWidth: 40 / SCALE,
    halfHeight: 1000 / SCALE,
    staticBody: true
  });
  box.addBody(leftWall);
  world[geomId] = leftWall;

  rightWall = new Rectangle({
    id: geomId,
    x: 850 / SCALE,
    y: 240 / SCALE,
    halfWidth: 40 / SCALE,
    halfHeight: 1000 / SCALE,
    staticBody: true
  });
  box.addBody(rightWall);
  world[geomId] = rightWall;


  geomId++;
  pyramid = new Polygon({
    id: geomId,
    points: [{x: 320 / SCALE, y: 440 / SCALE}, {x: 446 / SCALE, y: 290 / SCALE}, {x: 565 / SCALE, y: 440 / SCALE}],
    staticBody: true
  });
  box.addBody(pyramid);
  world[geomId] = pyramid;

  geomId++;
  nyan = new Rectangle({
    id: geomId,
    x: 116 / SCALE,
    y: 360 / SCALE,
    halfWidth: 40 / SCALE,
    halfHeight: 28 / SCALE,
    staticBody: false,
    draw: function(ctx, scale){ // we want to render the nyan cat with an image
      ctx.save();
      ctx.translate(this.x * scale, this.y * scale);
      ctx.rotate(this.angle); // this angle was given to us by box2d's calculations
      ctx.translate(-(this.x) * scale, -(this.y) * scale);
      ctx.fillStyle = this.color;
      ctx.drawImage(
        nyanImg,
        (this.x-this.halfWidth) * scale - 10, //lets offset it a little to the left
        (this.y-this.halfHeight) * scale
      );
      ctx.restore();
    }
  });
  box.addBody(nyan);
  world[geomId] = nyan;


  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    initInput: function(im){
      //tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
      im.addKeyAction(keys.DOWN_ARROW);

    },
    handleInput: function(im){
      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        box.applyImpulseDegrees(nyan.id, 270, speed);
      }

      if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        box.applyImpulseDegrees(nyan.id, 90, speed);
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        box.applyImpulseDegrees(nyan.id, 0, speed);
      }


      if(im.touchAction.isPressed()){ //mobile first :)
        box.applyImpulse(nyan.id, utils.radiansFromCenter({x:nyan.x * SCALE, y:nyan.y * SCALE},im.touchAction.position), speed / 2);
      }
      else if(im.mouseAction.isPressed()){
        box.applyImpulse(nyan.id, utils.radiansFromCenter({x:nyan.x * SCALE, y:nyan.y * SCALE},im.mouseAction.position), speed / 2);
      }
    },
    update: function(millis){
      
      box.update();//have box2d do an interation
      box.updateExternalState(world); //have update local objects with box2d state

      //update the animations
      orangePortalAnim.update(millis);
      bluePortalAnim.update(millis);


      //this is for simple distance-based collision detection outside of box2s
      var blueDist = utils.distance({x: nyan.x * SCALE, y: nyan.y * SCALE}, bluePortal);
      var orangeDist = utils.distance({x: nyan.x * SCALE, y: nyan.y * SCALE}, orangePortal);

      if(blueDist > portalCollisionDistance){
        bluePortal.collided = false;
      }
      if(orangeDist > portalCollisionDistance){
        orangePortal.collided = false;
      }

      if(orangeDist < portalCollisionDistance && !orangePortal.collided){
        bluePortal.collided = true;
        box.setPosition(nyan.id, bluePortal.x / SCALE, bluePortal.y / SCALE);
        rm.playSound(whoosh);
      }
      else if(blueDist < portalCollisionDistance && !bluePortal.collided){
        orangePortal.collided = true;
        box.setPosition(nyan.id, orangePortal.x / SCALE, orangePortal.y / SCALE);
        rm.playSound(backWhoosh);
      }


      // this uses a simple wrapper for box2d's own collision detection
      if(nyan.collisions){
        nyan.collisions.forEach(function(collision){
          if(collision.impulse > 10){
            //console.log('nyan collision impulse:', collision.id , collision.impulse);
            rm.playSound(hit);
          }
        });
      }

    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      orangePortalAnim.draw(context, orangePortal.x - orangePortalAnim.width / 2, orangePortal.y - orangePortalAnim.height / 2);
      bluePortalAnim.draw(context, bluePortal.x - bluePortalAnim.width / 2, bluePortal.y - bluePortalAnim.height / 2);
      nyan.draw(context, SCALE);
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});