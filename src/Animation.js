/**
 * Represents a series of frames that can be rendered as an animation.
 * @name Animation
 * @constructor Animation
 */

define([
  './AnimFrame',
  'dcl',
  'dcl/bases/Mixer'
], function(AnimFrame, dcl, Mixer){

  'use strict';

  var Animation = dcl(Mixer, {
    /**
     * The index of the current frame being used to render this Animation
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    currFrameIndex: 0,
    /**
     * The current number of milliseconds that this animation has been running
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    animTime: 0,
    /**
     * The total number of milliseconds for a complete cycle
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    totalDuration: 0,
    /**
     * The height in pixels
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    height: 64,
    /**
     * The width in pixels
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    width: 64,
    /**
     * The image to render
     * @type {Image}
     * @memberOf Animation#
     * @default
     */
    image: null,
    /**
     * The offset of the of pixels in the x slot from the source image
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    offsetX: 0,
    /**
     * The offset of the of pixels in the y slot from the source image
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    offsetY: 0,

    constructor: function(){
      this.start();
    },

    /**
     * Used to create an animation from a sheet of tiles
     * @function
     * @memberOf Animation#
     * @param  {Number} frameCount Number of frames in the animation
     * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
     * @param  {Image} img Image sheet to create animation from
     * @param  {Number} w Width of each tile in pixels
     * @param  {Number} h Height of each tile in pixels
     * @param  {Number} ySlot Slot on Y axis to start creating tiles
     * @return {Animation} Animation generated using parameters
     */
    createFromSheet: function(frameCount, frameTimes, img, w, h, ySlot){
      var anim = new Animation({
        image: img,
        height: h,
        width: w
      });

      var isFTArray = Array.isArray(frameTimes);

      var currentFrameTime = 1;
      if(!ySlot){
        ySlot = 0;
      }
      for(var j = 0; j < frameCount; j++){
        if(isFTArray){
          currentFrameTime = frameTimes[j];
        } else {
          currentFrameTime = frameTimes;
        }
        anim.addFrame(currentFrameTime, j, ySlot);
      }
      return anim;
    },

    /**
     * Creates a duplicate of this animation. The list of frames
     * are shared between the two Animations, but each Animation
     * can be animated independently.
     * @function
     * @memberOf Animation#
     */
    clone: function(){
      return new Animation({
        image: this.image,
        frames: this.frames,
        totalDuration: this.totalDuration
      });
    },

    /**
     * Adds an image to the animation with the specified duration (time to display the image).
     * @function
     * @memberOf Animation#
     * @param {Number} duration Duration of the frame
     * @param {Number} imageSlotX Slot on the X axis for the frame
     * @param {Number} imageSlotY Slot on the Y axis for the frame
     */
    addFrame: function(duration, imageSlotX, imageSlotY){
      if(!this.frames){
        this.frames = [];
      }
      this.totalDuration += duration;
      this.frames.push(new AnimFrame({
        endTime: this.totalDuration,
        image: this.image,
        imgSlotX: imageSlotX,
        imgSlotY: imageSlotY
      }));
    },

    /**
     * Starts this animation over from the beginning.
     * @function
     * @memberOf Animation#
     */
    start: function(){
      this.animTime = 0;
      this.currFrameIndex = 0;
    },

    /**
     * Updates this animation's current image (frame), if neccesary.
     * @function
     * @memberOf Animation#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    update: function(elapsedTime){
      if (this.frames.length > 1) {
        this.animTime += elapsedTime;

        if (this.animTime >= this.totalDuration) {
          this.animTime = this.animTime % this.totalDuration;
          this.currFrameIndex = 0;
        }

        while (this.animTime > this.frames[this.currFrameIndex].endTime) {
          this.currFrameIndex++;
        }
      }
    },

    /**
     * Gets this Animation's current animation frame. Returns null if this animation has no frames.
     * @function
     * @memberOf Animation#
     * @return {AnimationFrame|null} The animation frame at the current frame index or null if no frames are available
     */
    getCurrentFrame: function(){
      if (this.frames.length === 0) {
        return null;
      } else {
        return this.frames[this.currFrameIndex];
      }
    },

    /**
     * Draws the current frame into a 2d context.
     * @function
     * @memberOf Animation#
     * @param {Context} context The HTML5 drawing canvas
     * @param {Number} x The x coordinate in the graphics context
     * @param {Number} y The y coordinate in the graphics context
     */
    draw: function(context, x, y){
      var cf = this.getCurrentFrame();
      context.drawImage(this.image, cf.imgSlotX * this.width + this.offsetX, cf.imgSlotY * this.height + this.offsetY, this.width, this.height, x, y, this.width, this.height);
    }
  });

  return Animation;

});