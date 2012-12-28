/**

 Copyright 2011 Luis Montes

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**/

 /**
 * The Sprite class represents a simple animated character for a game
 * @name Sprite
 * @class Sprite
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  var Sprite = dcl(Mixer, {
    // position (pixels)
    x: 0.0,
    y: 0.0,
    // velocity (pixels per millisecond)
    dx: 0.0,
    dy: 0.0,
    name: null,
    collisionRadius: 40,

    /**
      * Updates this Sprite's Animation and its position based on the velocity.
      * @name Sprite#update
      * @function
      * @param {Number} elapsedTime The elapsed time in milliseconds since the previous update
      *
    */
    update: function(elapsedTime){
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;
      this.anim.update(elapsedTime);
    },


    getX: function(){
      return this.x;
    },

    getY: function(){
      return this.y;
    },

    setX: function(x){
      this.x = x;
    },

    setY: function(y){
      this.y = y;
    },

    /**
      * Gets this Sprite's width, based on the size of the current image.
      * @name Sprite#getWidth
      * @function
      *
    */
    getWidth: function(){
      return this.anim.width;
    },

    /**
      * Gets this Sprite's height, based on the size of the current image.
      * @name Sprite#getHeight
      * @function
      *
    */
    getHeight: function(){
      return this.anim.height;
    },

    /**
      * Gets the horizontal velocity of this Sprite in pixels per millisecond.
      * @name Sprite#getVelocityX
      * @function
      *
    */
    getVelocityX: function(){
      return this.dx;
    },

    /**
      * Gets the vertical velocity of this Sprite in pixels per millisecond.
      * @name Sprite#getVelocityY
      * @function
      *
    */
    getVelocityY: function(){
      return this.dy;
    },

    /**
      * Sets the horizontal velocity of this Sprite in pixels per millisecond.
      * @name Sprite#setVelocityX
      * @function
      * @param {Number} dx the x velocity in pixels per millisecond
      *
    */
    setVelocityX: function(dx){
      this.dx = this.limitSpeed(dx);
    },

    /**
      * Sets the vertical velocity of this Sprite in pixels per millisecond.
      * @name Sprite#setVelocityY
      * @function
      * @param {Number} dy the y velocity in pixels per millisecond
      *
    */
    setVelocityY: function(dy) {
      this.dy = this.limitSpeed(dy);
    },

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


    getMaxSpeed: function(){
      return this.maxSpeed;
    },

    /**
      * Gets this Sprite's current animation frame.
      * @name Sprite#getCurrentFrame
      * @function
      *
    */
    getCurrentFrame: function(){
      if(this.anim){
        return this.anim.getCurrentFrame();
      }
    },

    /**
      * @name Sprite#drawCurrentFrame
      * @function
      * @param {2dContext} context the HTML5 drawing context
      * @deprecated use draw()
      *
    */
    drawCurrentFrame: function(context){
      //this method is deprecated, use the draw() function
      var cf = this.anim.getCurrentFrame();
      context.drawImage(this.anim.image, cf.imgSlotX * this.anim.width, cf.imgSlotY * this.anim.height, this.anim.width, this.anim.height, this.x,this.y, this.anim.width, this.anim.height);
    },

    /**
      * Draws the sprite
      * @name Sprite#draw
      * @function
      * @param {2dContext} context the HTML5 drawing context
      *
    */
    draw: function(context){
      if(this.anim){
        this.anim.draw(context, this.x, this.y);
      }
    },

    clone: function() {
      return new Sprite({
        anim: this.anim.clone()
      });
    }
  });

  return Sprite;

});