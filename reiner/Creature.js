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

'use strict';

const _ = require('lodash');
const Sprite = require('../Sprite');
const Animation = require('../Animation');


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
const EAST = 0;
const NORTH = 1;
const NORTHEAST = 2;
const NORTHWEST = 3;
const SOUTH = 4;
const SOUTHEAST = 5;
const SOUTHWEST = 6;
const WEST = 7;
const STATE_WALKING = 0;
const STATE_DYING = 1;
const STATE_IDLE = 2;


class Creature extends Sprite {
  constructor(options){
    options = options || {};
    super(options);

    /**
    * The current state of the creature. Will be a value from the static constants.
    * @type {Number}
    * @memberOf Creature#
    * @default
    */
    this.state = STATE_IDLE;

    /**
    * An array of Animation objects (one for each direction) to display the creature in a walking state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    this.walkingAnims = [];

    /**
    * An array of Animation objects (one for each direction) to display the creature in a dying state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    this.dyingAnims = [];

    /**
    * An array of Animation objects (one for each direction) to display the creature in an idle state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    this.idleAnims = [];

    /**
    * The current direction that the creature is pointed. Will be a value from the static constansts.
    * @type {Number}
    * @memberOf Creature#
    * @default
    */
    this.direction = EAST;

    _.assign(this, options);
  }

  /**
   * Updates this creature's current direction (frame), and changes which animation it should be using if neccesary.
   * @function
   * @memberOf Creature#
   * @param {Number} elapsedTime Elapsed time in milliseconds
   */
  updateDirection(elapsedTime){
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
  }

  /**
   * Updates this creature's current animation.
   * @function
   * @memberOf Creature#
   * @param {Number} elapsedTime Elapsed time in milliseconds
   */
  updateAnimations(elapsedTime){
    if(this.state === this.statics.STATE_WALKING){
      this.anim = this.walkingAnims[this.direction];
    } else if(this.state === this.statics.STATE_DYING){
      this.anim = this.dyingAnims[this.direction];
    } else {
      this.anim = this.idleAnims[this.direction];
    }
    this.anim.update(elapsedTime);
  }

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
  createAnimations(frameCount, frameTimes, img, h, w, ySlot){
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
}

module.exports = Creature;
