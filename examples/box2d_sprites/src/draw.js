define([
  'frozen/plugins/loadImage!images/background.png'
], function(background){

  'use strict';

  function sortY(a, b){
    return a.y-b.y;
  }

  return function(ctx){
    ctx.drawImage(background, 0, 0, this.width, this.height);

    this.drawables.sort(sortY);

    //draw all of the box entities
    for(var i = 0; i < this.drawables.length; i++){
      this.drawables[i].draw(ctx, this.box.scale);
    }
  };

});