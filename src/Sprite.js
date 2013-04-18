/**
 * The Sprite class represents a simple animated character for a game
 * @name Sprite
 * @constructor Sprite
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  var Sprite = dcl(Mixer, {
    /**
     * The x position of the sprite in pixels
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    x: 0.0,
    /**
     * The y position of the sprite in pixels
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    y: 0.0,
    /**
     * The x component of the velocity in pixels per second
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    dx: 0.0,
    /**
     * The y component of the velocity in pixels per second
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    dy: 0.0,
    /**
     * The max speed a sprite can move in either direction
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    maxSpeed: 0.0,
    /**
     * The name of this Sprite
     * @type {String}
     * @memberOf Sprite#
     * @default
     */
    name: null,
    /**
     * The radius of this sprite in pixels for simple collision detection
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    collisionRadius: 40,

    /**
     * Updates this Sprite's Animation and its position based on the velocity.
     * @function
     * @memberOf Sprite#
     * @param {Number} elapsedTime The elapsed time in milliseconds since the previous update
     */
    update: function(elapsedTime){
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;
      this.anim.update(elapsedTime);
    },

    /**
     * Returns the maxSpeed up to the speed limit
     * @function
     * @memberOf Sprite#
     * @param {Number} v Speed limit
     * @return {Number} maxSpeed up to speed limit
     */
    limitSpeed: function(v){
      if(this.maxSpeed){
        if(Math.abs(v) > this.maxSpeed){
          if(v > 0){
            return this.maxSpeed;
          }else if(v < 0){
            return this.maxSpeed;
          }else{
            return  0;
          }
        }else{
          return v;
        }
      }else{
        return v;
      }
    },

    /**
     * Gets this Sprite's current animation frame.
     * @function
     * @memberOf Sprite#
     * @return {AnimationFrame} The current frame of the Animation
     */
    getCurrentFrame: function(){
      if(this.anim){
        return this.anim.getCurrentFrame();
      }
    },

    /**
     * Draws the sprite
     * @function
     * @memberOf Sprite#
     * @param {Context} context The HTML5 drawing context
     */
    draw: function(context){
      if(this.anim){
        this.anim.draw(context, this.x, this.y);
      }
    },

    /**
     * Clones the instance of Sprite it is called upon
     * @function
     * @memberOf Sprite#
     * @return {Sprite} A clone of the Sprite
     */
    clone: function() {
      return new Sprite({
        anim: this.anim.clone()
      });
    }
  });

  return Sprite;

});