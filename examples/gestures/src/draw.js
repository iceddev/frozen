define([
  'lodash/collections/forEach',
  'frozen/plugins/loadImage!images/background.png'
], function(forEach, background){

  'use strict';

  function sortY(a, b){
    return a.y - b.y;
  }

  return function(ctx){
    ctx.drawImage(background, 0, 0, this.width, this.height);

    this.drawables.sort(sortY);

    // draw all of the box entities
    var scale = this.box.scale;
    forEach(this.drawables, function(drawable){
      drawable.draw(ctx, scale);
    });
  };

});
