define(function(){

  'use strict';

  return function(ctx){
    ctx.fillStyle = '#AAA';
    ctx.fillRect(0, 0, this.width, this.height);
    for(var id in this.entities){
      this.entities[id].draw(ctx);
    }
  };

});