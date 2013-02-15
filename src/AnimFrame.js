/**
 * Represents a a single frame in an animation.
 * @name AnimationFrame
 * @class AnimationFrame
 * @property {Number}  endTime The ending time in milliseconds of this frame relative to its Animation
 * @property {Number}  imgSlotX The horizontal position of the group of frames contained in a single image
 * @property {Number}  imgSlotY The vertical position of the group of frames contained in a single image
 * @property {Image}  image The image to render
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    endTime: 0,
    imgSlotX: 0,
    imgSlotY: 0,
    image: null
  });

});