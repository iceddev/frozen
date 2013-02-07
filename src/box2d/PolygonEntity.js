/**
 * This Entity represents a polygon which is build from an array of points.
 * @name PolygonEntity
 * @class PolygonEntity
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
    points: [],
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeColor;

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

    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.points = scalePoints(this.points, scale);
        sup.apply(this, [scale]);
      };
    }),

    /**
      * Checks if a given point is contained within this Polygon.
      *
      * @name PolygonEntity#pointInShape
      * @function
      * @param {Object} point An object with x and y values.
    */
    pointInShape: function(point){
      return pointInPolygon(point, translatePoints(this.points, this));
    }
  });

});