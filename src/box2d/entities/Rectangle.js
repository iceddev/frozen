/**
 * This Entity represents a Rectangle
 * @name Rectangle
 * @constructor Rectangle
 * @extends Entity
 */

define([
  'dcl',
  './Entity'
], function(dcl, Entity){

  'use strict';

  return dcl(Entity, {
    declaredClass: 'frozen/box2d/entities/Rectangle',
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf Rectangle#
     * @default
     */
    halfWidth: 1,
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf Rectangle#
     * @default
     */
    halfHeight: 1,

    /**
     * Draws the Rectangle at a given scale
     * @function
     * @memberOf Rectangle#
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
     * @memberOf Rectangle#
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
     * @memberOf Rectangle#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      return ((point.x >= (this.x - this.halfWidth)) && (point.x <= (this.x + this.halfWidth)) && (point.y >= (this.y - this.halfHeight)) && (point.y <= (this.y + this.halfHeight)));
    }
  });

});