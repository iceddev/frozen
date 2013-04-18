/**
 * This Entity represents a polygon which is build from an array of points.
 * @name Polygon
 * @constructor Polygon
 * @extends Entity
 */

define([
  'dcl',
  './Entity',
  '../../utils/scalePoints',
  '../../utils/pointInPolygon',
  '../../utils/translatePoints'
], function(dcl, Entity, scalePoints, pointInPolygon, translatePoints){

  'use strict';

  return dcl(Entity, {
    declaredClass: 'frozen/box2d/entities/Polygon',
    /**
     * An array of objects that have x and y values.
     * @type {Array}
     * @memberOf Polygon#
     * @default
     */
    points: [],

    /**
     * Draws the Polygon at a given scale
     * @function
     * @memberOf Polygon#
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

        ctx.beginPath();
        ctx.moveTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
        for (var i = 1; i < this.points.length; i++) {
           ctx.lineTo((this.points[i].x + this.x) * scale, (this.points[i].y + this.y) * scale);
        }
        ctx.lineTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    /**
     * Scale this shape
     * @function
     * @memberOf Polygon#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.points = scalePoints(this.points, scale);
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this Polygon.
     * @function
     * @memberOf Polygon#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      return pointInPolygon(point, translatePoints(this.points, this));
    }
  });

});