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
     * Retrieves the X value
     * @memberOf Sprite#
     * @return {Number} The X value
     * @deprecated This method is deprecated because the x property is available on Sprite and it will be removed in the future
     */
    getX: function(){
      return this.x;
    },

    /**
     * Retrieves the Y value
     * @memberOf Sprite#
     * @return {Number} The Y value
     * @deprecated This method is deprecated because the y property is available on Sprite and it will be removed in the future
     */
    getY: function(){
      return this.y;
    },

    /**
     * Sets the X value
     * @memberOf Sprite#
     * @param {Number} x The new X value
     * @deprecated This method is deprecated because the x property is available on Sprite and it will be removed in the future
     */
    setX: function(x){
      this.x = x;
    },

    /**
     * Sets the Y value
     * @memberOf Sprite#
     * @param {Number} y The new Y value
     * @deprecated This method is deprecated because the y property is available on Sprite and it will be removed in the future
     */
    setY: function(y){
      this.y = y;
    },

    /**
     * Gets this Sprite's width, based on the size of the current image.
     * @function
     * @memberOf Sprite#
     * @return {Number} Width of the animation image
     * @deprecated This method is deprecated because the anim property is available on Sprite and it will be removed in the future
     */
    getWidth: function(){
      return this.anim.width;
    },

    /**
     * Gets this Sprite's height, based on the size of the current image.
     * @function
     * @memberOf Sprite#
     * @return {Number} Height of the animation image
     * @deprecated This method is deprecated because the anim property is available on Sprite and it will be removed in the future
     */
    getHeight: function(){
      return this.anim.height;
    },

    /**
     * Gets the horizontal velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @return {Number} The dx value
     * @deprecated This method is deprecated because the dx property is available on Sprite and it will be removed in the future
     */
    getVelocityX: function(){
      return this.dx;
    },

    /**
     * Gets the vertical velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @return {Number} The dy value
     * @deprecated This method is deprecated because the dy property is available on Sprite and it will be removed in the future
     */
    getVelocityY: function(){
      return this.dy;
    },

    /**
     * Sets the horizontal velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @param {Number} dx The x velocity in pixels per millisecond
     * @deprecated This method is deprecated because the dx property is available on Sprite and it will be removed in the future
     */
    setVelocityX: function(dx){
      this.dx = this.limitSpeed(dx);
    },

    /**
     * Sets the vertical velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @param {Number} dy the y velocity in pixels per millisecond
     * @deprecated This method is deprecated because the dy property is available on Sprite and it will be removed in the future
     */
    setVelocityY: function(dy) {
      this.dy = this.limitSpeed(dy);
    },

    /**
     * Returns the maxSpeed up to the speed limit
     * @function
     * @memberOf Sprite#
     * @param {Number} v Speed limit
     * @return {Number} maxSpeed up to speed limit
     */
    limitSpeed: function(v){
      if(this.getMaxSpeed()){
        if(Math.abs(v) > this.getMaxSpeed()){
          if(v > 0){
            return this.getMaxSpeed();
          }else if(v < 0){
            return this.getMaxSpeed();
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
     * Retrieves the maxSpeed
     * @function
     * @memberOf Sprite#
     * @return {Number} The maxSpeed
     * @deprecated This method is deprecated because the maxSpeed property is available on Sprite and it will be removed in the future
     */
    getMaxSpeed: function(){
      return this.maxSpeed;
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
     * Deprecated drawing function
     * @function
     * @memberOf Sprite#
     * @param {2dContext} context The HTML5 drawing context
     * @deprecated This method is deprecated because it was replaced by draw() and it will be removed in the future
     */
    drawCurrentFrame: function(context){
      var cf = this.anim.getCurrentFrame();
      context.drawImage(this.anim.image, cf.imgSlotX * this.anim.width, cf.imgSlotY * this.anim.height, this.anim.width, this.anim.height, this.x,this.y, this.anim.width, this.anim.height);
    },

    /**
     * Draws the sprite
     * @function
     * @memberOf Sprite#
     * @param {2dContext} context The HTML5 drawing context
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