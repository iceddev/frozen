/**
 * This represents a joint between two bodies.
 * @name Joint
 * @class Joint
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