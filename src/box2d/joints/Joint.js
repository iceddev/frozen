/**
 * This represents a joint between two bodies.
 * @name Joint
 * @class Joint
 * @property {String} bodyId1 The id of the first entity that will be attached to this joint
 * @property {String} bodyId2 The id of the second entity that will be attached to this joint
 * @property {Object} bodyPoint1 A point on the first entity where be attached to the second body. If no point is specified, the first body will be attached at its center point.
 * @property {Object} jointAttributes an object with any other properties that should be mixed into the box2d joint definition.
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    bodyId1: null,
    bodyId2: null,
    bodyPoint1: null,
    jointAttributes: null,

    /**
      * Scales the position that on the first body that the joint is connected at.
      * @name Entity#scaleJointLocation
      * @function
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