function genId() {
  return Math.random() + '_' + Date.now();
}

/**
 * This represents a joint between two bodies.
 * @name Joint
 * @constructor Joint
 */


class Joint {
  constructor(options = {}){

    /**
     * The id in which to reference this object. Also the userData property for box2d bodies.
     * @type {String}
     * @memberOf Entity#
     * @default
     */
    this.id = options.id || genId();

    /**
     * The id of the first entity that will be attached to this joint
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    this.bodyId1 = null;

    /**
     * The id of the second entity that will be attached to this joint
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    this.bodyId2 = null;

    /**
     * A point on the first entity where be attached to the second body. If no point is specified, the first body will be attached at its center point.
     * @type {Object}
     * @memberOf Joint#
     * @default
     */
    this.bodyPoint1 = null;

    /**
     * An object with any other properties that should be mixed into the box2d joint definition.
     * @type {Object}
     * @memberOf Joint#
     * @default
     */
    this.jointAttributes = null;

    Object.assign(this, options);
  }

  /**
   * Scales the position that on the first body that the joint is connected at.
   * @function
   * @memberOf Joint#
   * @param {Number} scale the scale to multiply the dimentions by
   */
  scaleJointLocation(scale){
    if(scale && this.bodyPoint1){
      this.bodyPoint1.x = this.bodyPoint1.x * scale;
      this.bodyPoint1.y = this.bodyPoint1.y * scale;
      this.alreadyScaled = true;
    }
  }
}

module.exports = Joint;
