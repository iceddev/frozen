/**
 * This Entity represents a Rectangle
 * @name Rectangle
 * @constructor Rectangle
 * @extends Entity
 */

'use strict';

const _ = require('lodash');
const Entity = require('./Entity');

class Rectangle extends Entity {
  constructor(options){
    options = options || {};
    super(options);

    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf Rectangle#
     * @default
     */
    this.halfWidth = 1;
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf Rectangle#
     * @default
     */
    this.halfHeight = 1;

    _.assign(this, options);
  }

  /**
   * Draws the Rectangle at a given scale
   * @function
   * @memberOf Rectangle#
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
    super.draw(ctx, scale);
  }

  /**
   * Scale this shape
   * @function
   * @memberOf Rectangle#
   * @param {Number} scale The amount the shape should scale
   */
  scaleShape(scale){
    this.halfHeight = this.halfHeight * scale;
    this.halfWidth = this.halfWidth * scale;
    super.scaleShape(scale);
  }

  /**
   * Checks if a given point is contained within this Rectangle.
   * @function
   * @memberOf Rectangle#
   * @param {Object} point An object with x and y values.
   * @return {Boolean} True if point is in shape else false
   */
  pointInShape(point){
    return ((point.x >= (this.x - this.halfWidth)) && (point.x <= (this.x + this.halfWidth)) && (point.y >= (this.y - this.halfHeight)) && (point.y <= (this.y + this.halfHeight)));
  }
}

module.exports = Rectangle;
