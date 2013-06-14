define([
  'dcl',
  'frozen/box2d/entities/Polygon',
  'frozen/plugins/loadImage!images/tavern.png'
], function(dcl, Polygon, img){

  'use strict';

  return dcl(Polygon, {
    points: [
      {
        x: -1.5,
        y: -76
      },
      {
        x: 100.5,
        y: 0
      },
      {
        x: 0.5,
        y: 76
      },
      {
        x: -99.5,
        y: 0
      }
    ],
    x: 579.5,
    y: 181,
    staticBody: true,
    id: 'tavern',
    draw: function(ctx){
      ctx.drawImage(img, 454, -11, img.width, img.height);
    }
  });

});