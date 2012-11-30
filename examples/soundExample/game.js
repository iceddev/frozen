//load the AMD modules we need
require(['frozen/GameCore', 'frozen/ResourceManager', 'dojo/keys'], function(GameCore, ResourceManager, keys){

  var x = 100;
  var y = 100;
  var speed = 2.5;

  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/background.png');
  var nyan = rm.loadImage('images/nyan.png');
  var yipee = rm.loadSound('sounds/yipee.wav');

  console.log(keys);

  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      context.drawImage(nyan, x, y);
    },
    initInput: function(){
      //tells the input manager to listen for key events
      this.inputManager.addKeyAction(keys.LEFT_ARROW);
      this.inputManager.addKeyAction(keys.RIGHT_ARROW);
      this.inputManager.addKeyAction(keys.UP_ARROW);
      this.inputManager.addKeyAction(keys.DOWN_ARROW);

      //the extra param says to only detect inital press
      this.inputManager.addKeyAction(keys.SPACE, true);
    },
    update: function(millis){
      
      //just an example showing how to check for presses, could be done more effeciently

      if(this.inputManager.keyActions[keys.LEFT_ARROW].isPressed()){
        x-= speed;
      }

      if(this.inputManager.keyActions[keys.RIGHT_ARROW].isPressed()){
        x+= speed;
      }

      if(this.inputManager.keyActions[keys.UP_ARROW].isPressed()){
        y-= speed;
      }

      if(this.inputManager.keyActions[keys.DOWN_ARROW].isPressed()){
        y+= speed;
      }

      //.play sounds with the space bar !
      if(this.inputManager.keyActions[keys.SPACE].getAmount()){
        rm.playSound(yipee);
      }

      // move to the mouse's location
      if(this.inputManager.mouseAction.isPressed()){
        x = this.inputManager.mouseAction.position.x;
        y = this.inputManager.mouseAction.position.y;
      }

    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});