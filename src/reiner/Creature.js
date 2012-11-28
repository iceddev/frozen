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

/*
 * This type of sprite is based off of the excellent images from Reiner's tilesets: http://www.reinerstilesets.de/
 *
 * creatures have walking, idle, and dying animations in 8 isometric directions
 * The animations directions are in E,N,NE,NW,S,SE,SW,W (alphabetical) order simply because that's
 * how i stitched them together using ImageMagick.
 *
 */

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  '../Sprite',
  '../Animation'
], function(declare, lang, Sprite, Animation){

  return declare([Sprite], {
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
    state: 0,
    walkingAnims: [],
    dyingAnims: [],
    idleAnims: [],
    direction: 0,
    constructor: function(args){
      this.state = this.statics.STATE_IDLE;
      this.direction = this.statics.EAST;
      declare.safeMixin(this, args);
    },
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
    createAnimations: function(frameCount, frameTimes, img, h, w, ySlot){
      var anims = [];
      var isFTArray = lang.isArray(frameTimes);
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