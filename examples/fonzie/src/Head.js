define([
  'dcl',
  'frozen/box2d/entities/Circle',
  'frozen/plugins/loadImage!images/head.png'
], function(dcl, Circle, headImg){

  'use strict';

  return dcl(Circle, {
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;

        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.drawImage(headImg, this.x * scale - (headImg.width / 2), this.y * scale - (headImg.height / 2));
        ctx.restore();
      };
    })
  });

});