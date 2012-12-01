//load the AMD modules we need
require(['frozen/GameCore', 'frozen/ResourceManager', 'frozen/Sprite', 'frozen/Animation', 'dojo/keys'], function(GameCore, ResourceManager, Sprite, Animation, keys){

  var speed = 0.5;

  //setup a ResourceManager to use in the game
  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/background.png');
  var spriteImg = rm.loadImage('images/walking.png');

  //new sprite object maintian position, and velocities
  var sprite = new Sprite({x:100,y:100, w:96, h: 96, dx:0, dy: 0});

  //set the sprite animation to use 8 frames, 100 millis/frame, spritesheet, 96x96 pixels
  sprite.anim = new Animation().createFromTile(8,100,spriteImg,96,96);
  
  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    initInput: function(im){ //im = this.inputManager
      //tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
      im.addKeyAction(keys.DOWN_ARROW);
    },
    handleInput: function(im){

      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        sprite.dx = speed * -1;
      }
      else if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        sprite.dx = speed;
      }
      else{
        sprite.dx = 0;
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        sprite.dy = speed * -1;
      }
      else if(im.keyActions[keys.DOWN_ARROW].isPressed()){
        sprite.dy = speed;
      }
      else{
        sprite.dy = 0;
      }
    },
    update: function(millis){
      // update the sprite based on how many milliseconds have passed
      sprite.update(millis);
    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      sprite.drawCurrentFrame(context);
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});