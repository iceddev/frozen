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

/*********************** mwe.Sprite ********************************************/
define(['dojo/_base/declare'], function(declare){

  var Sprite = declare(null, {
    // position (pixels)
    x: 0.0,
    y: 0.0,
    // velocity (pixels per millisecond)
    dx: 0.0,
    dy: 0.0,
    name: null,
    collisionRadius: 40,
    /**
      Creates a new Sprite object.
    */
    constructor: function(args){
      declare.safeMixin(this, args);
    },
    /**
      Updates this Sprite's Animation and its position based on the velocity.
    */
    update: function(elapsedTime){
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;
      this.anim.update(elapsedTime);
    },
    /**
      Gets this Sprite's current x position.
    */
    getX: function(){
      return this.x;
    },
    /**
      Gets this Sprite's current y position.
    */
    getY: function(){
      return this.y;
    },
    /**
      Sets this Sprite's current x position.
    */
    setX: function(x){
      this.x = x;
    },
    /**
      Sets this Sprite's current y position.
    */
    setY: function(y){
      this.y = y;
    },
    /**
      Gets this Sprite's width, based on the size of the current image.
    */
    getWidth: function(){
      return this.anim.width;
    },
    /**
      Gets this Sprite's height, based on the size of the current image.
    */
    getHeight: function(){
      return this.anim.height;
    },
    /**
      Gets the horizontal velocity of this Sprite in pixels per millisecond.
    */
    getVelocityX: function(){
      return this.dx;
    },
    /**
      Gets the vertical velocity of this Sprite in pixels per millisecond.
    */
    getVelocityY: function(){
      return this.dy;
    },
    /**
      Sets the horizontal velocity of this Sprite in pixels per millisecond.
    */
    setVelocityX: function(dx){
      this.dx = this.limitSpeed(dx);
    },
    /**
      Sets the vertical velocity of this Sprite in pixels per millisecond.
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
    /**
      Gets the maximum speed of this Creature.
    */
    getMaxSpeed: function(){
      return this.maxSpeed;
    },
    /**
      Gets this Sprite's current animation frame.
    */
    getCurrentFrame: function(){
      if(this.anim){
        return this.anim.getCurrentFrame();
      }
    },
    drawCurrentFrame: function(context){
      //this method is deprecated, use the draw() function
      var cf = this.anim.getCurrentFrame();
      context.drawImage(this.anim.image, cf.imgSlotX * this.anim.width, cf.imgSlotY * this.anim.height, this.anim.width, this.anim.height, this.x,this.y, this.anim.width, this.anim.height);
    },
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