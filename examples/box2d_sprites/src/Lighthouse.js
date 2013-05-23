define([
  'dcl',
  'frozen/box2d/entities/Circle',
  'frozen/plugins/loadImage!images/lighthouse.png'
], function(dcl, Circle, img){

  'use strict';

  return dcl(Circle, {
    x: 159,
    y: 258,
    radius: 56.356011214421486,
    staticBody: true,
    id: 'lighthouse',
    draw: function(ctx){
      ctx.drawImage(img, 102, 60, img.width, img.height);
    }
  });

});