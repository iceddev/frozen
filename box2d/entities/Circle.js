/**
 * This represents a Circle body and shape in a Box2d world
 * @name Circle
 * @constructor Circle
 * @extends Entity
 */

const Entity = require('./Entity');
const distance = require('../../utils/distance');

class Circle extends Entity{
  constructor(options = {}){
    super(options);

    /**
     * The radius of this circle.
     * @type {Number}
     * @memberOf Circle#
     * @default
     */
    this.radius = 1;

    Object.assign(this, options);
  }

  /**
   * Draws the Circle at a given scale
   * @function
   * @memberOf Circle#
   * @param {Context} ctx The drawing context
   * @param {Number} scale The scale at which to draw
   */
  draw(ctx, scale){
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

    super.draw(ctx, scale);
  }

  /**
   * Scale this shape
   * @function
   * @memberOf Circle#
   * @param {Number} scale The amount the shape should scale
   */
  scaleShape(scale){
    this.radius = this.radius * scale;
    super.scaleShape(scale);
  }


  /**
   * Checks if a given point is contained within this Circle.
   * @function
   * @memberOf Circle#
   * @param {Object} point An object with x and y values.
   * @return {Boolean} True if point is in shape else false
   */
  pointInShape(point){
    return (distance(point, this) <= this.radius);
  }

}

module.exports = Circle;
