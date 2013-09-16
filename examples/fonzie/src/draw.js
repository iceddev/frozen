define([
  'lodash/collections/forEach'
], function(forEach){

  'use strict';

  return function(ctx){
    ctx.fillStyle = '#AAA';
    ctx.fillRect(0, 0, this.width, this.height);
    forEach(this.entities, function(entity){
      entity.draw(ctx);
    });
  };

});
