/**
 * This represents a joint between two bodies.
 * @name Joint
 * @constructor Joint
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    declaredClass: 'frozen/box2d/joints/Joint',
    /**
     * The id of the first entity that will be attached to this joint
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    bodyId1: null,
    /**
     * The id of the second entity that will be attached to this joint
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    bodyId2: null,
    /**
     * A point on the first entity where be attached to the second body. If no point is specified, the first body will be attached at its center point.
     * @type {Object}
     * @memberOf Joint#
     * @default
     */
    bodyPoint1: null,
    /**
     * An object with any other properties that should be mixed into the box2d joint definition.
     * @type {Object}
     * @memberOf Joint#
     * @default
     */
    jointAttributes: null,

    /**
     * Scales the position that on the first body that the joint is connected at.
     * @function
     * @memberOf Joint#
     * @param {Number} scale the scale to multiply the dimentions by
     */
    scaleJointLocation: function(scale){
      if(scale && this.bodyPoint1){
        this.bodyPoint1.x = this.bodyPoint1.x * scale;
        this.bodyPoint1.y = this.bodyPoint1.y * scale;
        this.alreadyScaled = true;
      }
    }

  });

});