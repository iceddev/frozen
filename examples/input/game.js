//load the AMD modules we need
require(['frozen/GameCore', 'dojo/keys'], function(GameCore, keys){

  var x = 100;
  var y = 100;
  var speed = 2.5;

  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    draw: function(context){
      context.clearRect(0, 0, this.width, this.height);
      context.fillRect(x, y, 50, 50);
    },
    initInput: function(){
      //tells the input manager to listen for key events
      this.inputManager.addKeyAction(keys.LEFT_ARROW);
      this.inputManager.addKeyAction(keys.RIGHT_ARROW);
      this.inputManager.addKeyAction(keys.UP_ARROW);
      this.inputManager.addKeyAction(keys.DOWN_ARROW);
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
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});