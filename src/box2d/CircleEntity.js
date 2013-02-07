/**
 * This represents a Circly body and shape in a Box2d world
 * @name CircleEntity
 * @class CircleEntity
 * @extends Entity
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './Entity',
  '../utils/distance'
], function(dcl, Mixer, Entity, distance){

  'use strict';

  return dcl([Mixer, Entity], {
    radius: 1,

    /**
      * Draws the CircelEntity at a given scale
      * @name CircleEntity#draw
      * @function
    */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if(!this.staticBody){
          ctx.save();
          ctx.translate(this.x * scale, this.y * scale);
          ctx.rotate(this.angle);
          ctx.translate(-(this.x) * scale, -(this.y) * scale);
          ctx.beginPath();
          ctx.moveTo(this.x * scale, this.y * scale);
          ctx.lineTo(this.x * scale, (this.y * scale) - (this.radius * scale));
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.radius = this.radius * scale;
        sup.apply(this, [scale]);
      };
    }),

    /**
      * Checks if a given point is contained within this Circle.
      *
      * @name CircelEntity#pointInShape
      * @function
      * @param {Object} point An object with x and y values.
    */
    pointInShape: function(point){
      return (distance(point, this) <= this.radius);
    }
  });

});