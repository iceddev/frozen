/**
 * This type of sprite is based off of the excellent images from Reiner's tilesets: http://www.reinerstilesets.de/
 * <br>
 * creatures have walking, idle, and dying animations in 8 isometric directions
 * The animations directions are in E,N,NE,NW,S,SE,SW,W (alphabetical) order simply because that's
 * how they were stitched together using ImageMagick.
 *
 * @name Creature
 * @constructor Creature
 * @extends Sprite
 */

define([
  'dcl',
  '../Sprite',
  '../Animation'
], function(dcl, Sprite, Animation){

  'use strict';

  return dcl(Sprite, {
    /**
    * A map of static constants for internal use
    * @type {Object}
    * @memberOf Creature#
    * @property {Number} EAST a direction the creature can face
    * @property {Number} NORTH a direction the creature can face
    * @property {Number} NORTHEAST a direction the creature can face
    * @property {Number} NORTHWEST a direction the creature can face
    * @property {Number} SOUTH a direction the creature can face
    * @property {Number} SOUTHEAST a direction the creature can face
    * @property {Number} SOUTHWEST a direction the creature can face
    * @property {Number} WEST a direction the creature can face
    * @property {Number} STATE_WALKING a state the creature can be in
    * @property {Number} STATE_DYING a state the creature can be in
    * @property {Number} STATE_IDLE a state the creature can be in
    */
    statics: {
      EAST: 0,
      NORTH: 1,
      NORTHEAST: 2,
      NORTHWEST: 3,
      SOUTH: 4,
      SOUTHEAST: 5,
      SOUTHWEST: 6,
      WEST: 7,
      STATE_WALKING: 0,
      STATE_DYING: 1,
      STATE_IDLE: 2
    },
    /**
    * The current state of the creature. Will be a value from the static constants.
    * @type {Number}
    * @memberOf Creature#
    * @default
    */
    state: 0,
    /**
    * An array of Animation objects (one for each direction) to display the creature in a walking state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    walkingAnims: [],
    /**
    * An array of Animation objects (one for each direction) to display the creature in a dying state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    dyingAnims: [],
    /**
    * An array of Animation objects (one for each direction) to display the creature in an idle state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    idleAnims: [],
    /**
    * The current direction that the creature is pointed. Will be a value from the static constansts.
    * @type {Number}
    * @memberOf Creature#
    * @default
    */
    direction: 0,
    constructor: function(){
      this.state = this.statics.STATE_IDLE;
      this.direction = this.statics.EAST;
    },
    /**
     * Updates this creature's current image (frame), and changes which animation it should be using if neccesary.
     * @function
     * @memberOf Creature#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    update: function(elapsedTime){
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;

      if(this.state !== this.statics.STATE_DYING){
        if(this.dx > 0 && this.dy === 0){
          this.direction = this.statics.EAST;
        } else if(this.dx === 0 && this.dy < 0){
          this.direction = this.statics.NORTH;
        } else if(this.dx > 0 && this.dy < 0){
          this.direction = this.statics.NORTHEAST;
        } else if(this.dx < 0 && this.dy < 0){
          this.direction = this.statics.NORTHWEST;
        } else if(this.dx === 0 && this.dy > 0){
          this.direction = this.statics.SOUTH;
        } else if(this.dx > 0 && this.dy > 0){
          this.direction = this.statics.SOUTHEAST;
        } else if(this.dx < 0 && this.dy > 0){
          this.direction = this.statics.SOUTHWEST;
        } else if(this.dx < 0 && this.dy === 0){
          this.direction = this.statics.WEST;
        }

        if(this.dx === 0 && this.dy === 0){
          this.state = this.statics.STATE_IDLE;
        } else {
          this.state = this.statics.STATE_WALKING;
        }
      }

      if(this.state === this.statics.STATE_WALKING){
        this.anim = this.walkingAnims[this.direction];
      } else if(this.state === this.statics.STATE_DYING){
        this.anim = this.dyingAnims[this.direction];
      } else {
        this.anim = this.idleAnims[this.direction];
      }
      this.anim.update(elapsedTime);
    },
    /**
     * Used to create animations from a sheet of tiles
     * @function
     * @memberOf Creature#
     * @param  {Number} frameCount Number of frames in the animation
     * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
     * @param  {Image} img Image sheet to create animation from
     * @param  {Number} w Width of each tile in pixels
     * @param  {Number} h Height of each tile in pixels
     * @param  {Number} ySlot Slot on Y axis to start creating tiles
     * @return {Array} Array of Animations generated using parameters
     */
    createAnimations: function(frameCount, frameTimes, img, h, w, ySlot){
      var anims = [];
      var isFTArray = Array.isArray(frameTimes);
      var currentFrameTime = 1;
      if(!ySlot){
        ySlot = 0;
      }
      for(var i = 0; i < 8; i++){
        anims[i] = new Animation({
          height: h,
          width: w,
          image: img
        });
        for(var j = 0; j < frameCount; j++){
          if(isFTArray){
            currentFrameTime = frameTimes[j];
          } else {
            currentFrameTime = frameTimes;
          }
          anims[i].addFrame(currentFrameTime, j + frameCount * i, ySlot);
        }
      }
      return anims;
    }
  });

});