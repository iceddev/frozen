/**
 * Represents a a single frame in an animation.
 * @name AnimationFrame
 * @class AnimationFrame
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