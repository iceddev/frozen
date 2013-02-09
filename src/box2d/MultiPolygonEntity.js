/**
 * This Entity is for building complex and possibly concave shapes
 * @name MultiPolygonEntity
 * @class MultiPolygonEntity
 * @extends Entity
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './Entity',
  '../utils/scalePoints',
  '../utils/pointInPolygon',
  '../utils/translatePoints'
], function(dcl, Mixer, Entity, scalePoints, pointInPolygon, translatePoints){

  'use strict';

  return dcl([Mixer, Entity], {
    polys: [],

    /**
      * Draws each polygon in the entity
      * @name MultiPolygonEntity#draw
      * @function
      * @param {2dContext} ctx the HTML5 2d drawing context
      * @param {Number} scale the scale to draw the entity at
      *
      */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;

        for(var j = 0; j < this.polys.length; j++){
          ctx.beginPath();
          ctx.moveTo((this.x + this.polys[j][0].x) * scale, (this.y + this.polys[j][0].y) * scale);
          for (var i = 1; i < this.polys[j].length; i++) {
             ctx.lineTo((this.polys[j][i].x + this.x) * scale, (this.polys[j][i].y + this.y) * scale);
          }
          ctx.lineTo((this.x + this.polys[j][0].x) * scale, (this.y + this.polys[j][0].y) * scale);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.polys = scalePoints(this.polys, scale);
        sup.apply(this, [scale]);
      };
    }),

    /**
      * Checks if a given point is contained within this MultiPolygon.
      *
      * @name MultiPolygonEntity#pointInShape
      * @function
      * @param {Object} point An object with x and y values.
    */
    pointInShape: function(point){
      for(var j = 0; j < this.polys.length; j++){
        if(pointInPolygon(point, translatePoints(this.polys[j], this))){
          return true;
        }
      }
      return false;
    }
  });

});