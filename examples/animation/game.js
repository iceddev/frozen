//load the AMD modules we need
require(['frozen/GameCore'], function(GameCore, keys){

  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    x: 0,
    y: 0,
    draw: function(context){
      context.clearRect(0, 0, this.width, this.height);
      context.fillRect(this.x, this.y, 50, 50);
    },
    update: function(millis){
      this.x += 1;
      this.y += 1;
    }
  });

  //if you want to take a look at the game object in dev tools
  console.log(game);
  console.log(keys);

  //launch the game!
  game.run();
});