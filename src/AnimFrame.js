/**
 * Represents a a single frame in an animation.
 * @name AnimationFrame
 * @constructor AnimationFrame
 * @param {Object} mixin Object containing properties to mixin
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * The ending time in milliseconds of this frame relative to its Animation
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    endTime: 0,
    /**
     * The horizontal position of the group of frames contained in a single image
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    imgSlotX: 0,
    /**
     * The vertical position of the group of frames contained in a single image
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    imgSlotY: 0,
    /**
     * The image to render
     * @type {Image}
     * @memberOf AnimationFrame#
     * @default
     */
    image: null
  });

});