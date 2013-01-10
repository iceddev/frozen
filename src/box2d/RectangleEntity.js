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
 * This Entity represents a Rectangle
 * @name RectangleEntity
 * @class RectangleEntity
 * @extends Entity
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './Entity'
], function(dcl, Mixer, Entity){

  'use strict';

  return dcl([Mixer, Entity], {
    halfWidth: 1,
    halfHeight: 1,

    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillRect(
          (this.x-this.halfWidth) * scale,
          (this.y-this.halfHeight) * scale,
          (this.halfWidth*2) * scale,
          (this.halfHeight*2) * scale
        );
        ctx.strokeRect(
          (this.x-this.halfWidth) * scale,
          (this.y-this.halfHeight) * scale,
          (this.halfWidth*2) * scale,
          (this.halfHeight*2) * scale
        );
        ctx.restore();
        sup.apply(this, [ctx, scale]);
      };
    }),

    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.halfHeight = this.halfHeight * scale;
        this.halfWidth = this.halfWidth * scale;
        sup.apply(this, [scale]);
      };
    })
  });

});