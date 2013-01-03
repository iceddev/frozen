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
 * This Entity represents a polygon which is build from an array of points.
 * @name PolygonEntity
 * @class PolygonEntity
 * @extends Entity
*/

define([
  'dcl',
  'dcl/bases/Mixer',
  './Entity',
  '../utils' // TODO: specific util, not whole module
], function(dcl, Mixer, Entity, utils){

  'use strict';

  return dcl([Mixer, Entity], {
    points: [],
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
        for (var i = 1; i < this.points.length; i++) {
           ctx.lineTo((this.points[i].x + this.x) * scale, (this.points[i].y + this.y) * scale);
        }
        ctx.lineTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        sup.apply(this, [ctx, scale]);
      };
    }),

    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.points = utils.scalePoints(this.points, scale);
        sup.apply(this, [scale]);
      };
    })
  });

});