define([
  'lodash'
], function(_){

  'use strict';

  return function(ctx){
    ctx.fillStyle = '#AAA';
    ctx.fillRect(0, 0, this.width, this.height);
    _.forEach(this.entities, function(entity){
      entity.draw(ctx);
    });
  };

});