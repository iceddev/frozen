//load the AMD modules we need
require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys', 'frozen/box2d/Box', 'frozen/box2d/RectangleEntity', 'frozen/box2d/PolygonEntity', 'frozen/box2d/CircleEntity'],
 function(GameCore, ResourceManager, keys, Box, Rectangle, Polygon, Circle){

  //dimensions same as canvas.
  var gameH = 480;
  var gameW = 770;
  
  var speed = 8;

  var output = document.getElementById('output');

  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/background.png');
  var nyanImg = rm.loadImage('images/nyan.png');
  var yarnImg = rm.loadImage('images/yarn.png');
  var yipee = rm.loadSound('sounds/yipee.wav');

  var box;
  var world = {};

  //pixels per meter for box2d
  var SCALE = 30.0;

  //objects in box2d need an id
  var geomId = 1;

  //shapes in the box2 world, locations are their centers
  var nyan, moon, pyramid, ground, ceiling, leftWall, rightWall, yarn;



  // create our box2d instance
  box = new Box({intervalRate:60, adaptive:false, width:gameW, height:gameH, scale:SCALE, gravityY:9.8, resolveCollisions: true,
   postSolve: function(idA, idB, impulse){
    if(impulse > 3){
      console.log(idA, idB, impulse);
    }
   }});
  

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
  moon = new Circle({
    id: geomId,
    x: 626 / SCALE,
    y: 120 / SCALE,
    radius: 63 / SCALE,
    staticBody: true
  });
  box.addBody(moon);
  world[geomId] = moon;

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

  geomId++;
  yarn = new Circle({
    id: geomId,
    x: 600 / SCALE,
    y: 390 / SCALE,
    radius: 30 / SCALE,
    staticBody: false,
    density: 0.5,  // al little lighter
    restitution: 0.8, // a little bouncier
    draw: function(ctx, scale){  //we also want to render the yarn with an image
      ctx.save();
      ctx.translate(this.x * scale, this.y * scale);
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * scale, -(this.y) * scale);
      ctx.fillStyle = this.color;
      ctx.drawImage(
        yarnImg,
        (this.x-this.radius) * scale,
        (this.y-this.radius) * scale
      );
      ctx.restore();
    }
  });
  box.addBody(yarn);
  world[geomId] = yarn;




  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    initInput: function(im){
      //tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);

      //the extra param says to only detect inital press
      im.addKeyAction(keys.SPACE, true);
    },
    handleInput: function(im){
      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 180, speed);
      }

      if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 0, speed);
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 270, speed);
      }

      //.play sounds with the space bar !
      if(im.keyActions[keys.SPACE].getAmount()){
        rm.playSound(yipee);
      }

      //when creating geometry, you may want to use the to determine where you are on the canvas
      //if(im.mouseAction.position){
        //output.innerHTML = 'x: ' + im.mouseAction.position.x + ' y: ' + im.mouseAction.position.y;
      //}
    },
    update: function(millis){
      
      //have box2d do an interation
      box.update();

      //update the dyanmic shapes with box2d calculations
      var bodiesState = box.getState();
      for (var id in bodiesState) {
        var entity = world[id];
        if (entity && !entity.staticBody){
          entity.update(bodiesState[id]);
        }
      }

    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      //ground.draw(context, SCALE);
      //moon.draw(context, SCALE);
      //pyramid.draw(context, SCALE);
      nyan.draw(context, SCALE);
      yarn.draw(context, SCALE);
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});