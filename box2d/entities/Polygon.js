/**
 * This Entity represents a polygon which is build from an array of points.
 * @name Polygon
 * @constructor Polygon
 * @extends Entity
 */

'use strict';

const _ = require('lodash');
const Entity = require('./Entity');
const scalePoints = require('../../utils/scalePoints');
const pointInPolygon = require('../../utils/pointInPolygon');
const translatePoints = require('../../utils/translatePoints');

class Polygon extends Entity {
  constructor(options){
    options = options || {};
    super(options);

    /**
     * An array of objects that have x and y values.
     * @type {Array}
     * @memberOf Polygon#
     * @default
     */
    this.points = [];

    _.assign(this, options);
  }

  /**
   * Draws the Polygon at a given scale
   * @function
   * @memberOf Polygon#
   * @param {Context} ctx The drawing context
   * @param {Number} scale The scale at which to draw
   */
  draw(ctx, scale){
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
    super.draw(ctx, scale);
  }

  /**
   * Scale this shape
   * @function
   * @memberOf Polygon#
   * @param {Number} scale The amount the shape should scale
   */
  scaleShape(scale){
    this.points = scalePoints(this.points, scale);
    super.scaleShape(scale);
  }

  /**
   * Checks if a given point is contained within this Polygon.
   * @function
   * @memberOf Polygon#
   * @param {Object} point An object with x and y values.
   * @return {Boolean} True if point is in shape else false
   */
  pointInShape(point){
    return pointInPolygon(point, translatePoints(this.points, this));
  }
}

module.exports = Polygon;
