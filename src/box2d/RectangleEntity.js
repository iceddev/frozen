/**
 * This Entity represents a Rectangle
 * @name RectangleEntity
 * @constructor RectangleEntity
 * @extends Entity
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './Entity'
], function(dcl, Mixer, Entity){

  'use strict';

  return dcl([Mixer, Entity], {
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf RectangleEntity#
     * @default
     */
    halfWidth: 1,
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf RectangleEntity#
     * @default
     */
    halfHeight: 1,

    /**
     * Draws the RectangleEntity at a given scale
     * @function
     * @memberOf RectangleEntity#
     * @param {Context} ctx The drawing context
     * @param {Number} scale The scale at which to draw
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
        ctx.fillRect(
          (this.x-this.halfWidth) * scale,
          (this.y-this.halfHeight) * scale,
          (this.halfWidth*2) * scale,
          (this.halfHeight*2) * scale
        );
        ctx.strokeRect(
          (this.x-this.halfWidth) * scale,
          (this.y-this.halfHeight) * scale,
          (this.halfWidth*2) * scale,
          (this.halfHeight*2) * scale
        );
        ctx.restore();
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    /**
     * Scale this shape
     * @function
     * @memberOf RectangleEntity#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.halfHeight = this.halfHeight * scale;
        this.halfWidth = this.halfWidth * scale;
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this Rectangle.
     * @function
     * @memberOf RectangleEntity#
     * @param {Object} point An object with x and y values.
     */
    pointInShape: function(point){
      return ((point.x >= (this.x - this.halfWidth)) && (point.x <= (this.x + this.halfWidth)) && (point.y >= (this.y - this.halfHeight)) && (point.y <= (this.y + this.halfHeight)));
    }
  });

});