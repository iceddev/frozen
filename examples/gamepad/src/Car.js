define([
  'dcl',
  'frozen/box2d/entities/Polygon',
  'frozen/plugins/loadImage!images/car.png'
], function(dcl, Polygon, carImg){

  'use strict';

  return dcl(Polygon, {
    restitution: 0.3,
    angularDamping: 2,
    linearDamping: 2,
    draw: function(ctx, scale){
      scale = scale || this.scale || 1;

      ctx.save();
      ctx.translate(this.x * scale, this.y * scale);
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * scale, -(this.y) * scale);
      ctx.drawImage(carImg, this.x * scale - (carImg.width / 2), this.y * scale - (carImg.height / 2));
      ctx.restore();
    }

  });

});