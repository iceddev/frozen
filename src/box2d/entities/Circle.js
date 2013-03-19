/**
 * This represents a Circle body and shape in a Box2d world
 * @name Circle
 * @constructor Circle
 * @extends Entity
 */

define([
  'dcl',
  './Entity',
  '../../utils/distance'
], function(dcl, Entity, distance){

  'use strict';

  return dcl(Entity, {
    declaredClass: 'frozen/box2d/entities/Circle',
    /**
     * The radius of this circle.
     * @type {Number}
     * @memberOf Circle#
     * @default
     */
    radius: 1,

    /**
     * Draws the Circle at a given scale
     * @function
     * @memberOf Circle#
     * @param {Context} ctx The drawing context
     * @param {Number} scale The scale at which to draw
     */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
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

    /**
     * Scale this shape
     * @function
     * @memberOf Circle#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.radius = this.radius * scale;
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this Circle.
     * @function
     * @memberOf Circle#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      return (distance(point, this) <= this.radius);
    }
  });

});