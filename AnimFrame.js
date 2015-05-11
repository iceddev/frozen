/**
 * Represents a a single frame in an animation.
 * @name AnimationFrame
 * @constructor AnimationFrame
 * @param {Object} mixin Object containing properties to mixin
 */

'use strict';

const _ = require('lodash');

class AnimFrame {
  constructor(options){
    options = options || {};

    /**
     * The ending time in milliseconds of this frame relative to its Animation
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    this.endTime = 0;

    /**
     * The horizontal position of the group of frames contained in a single image
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    this.imgSlotX = 0;

    /**
     * The vertical position of the group of frames contained in a single image
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    this.imgSlotY = 0;

    /**
     * The image to render
     * @type {Image}
     * @memberOf AnimationFrame#
     * @default
     */
    this.image = null;

    _.assign(this, options);
  }

}

module.exports = AnimFrame;
