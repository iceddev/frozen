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

define([
  'dojo/_base/declare',
  'dojo/_base/lang'
], function(declare, lang){

  return declare(null, {
    id: 0,
    x: 0,
    y: 0,
    angle: 0,
    center: 0,
    restitution: 0.3,
    density: 1.0,
    friction: 0.9,
    linearDamping: 0,
    linearVelocity: null,
    angularVelocity: 0,
    angularDamping: 0,
    staticBody: false,
    color: 'rgba(128,128,128,0.5)',
    hidden: false,
    constructor: function(/* Object */args){
      declare.safeMixin(this, args);
    },
    update: function(state){
      lang.mixin(this, state);
    },
    draw: function(ctx, scale){
      //black circle in entity's location
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.x * scale, this.y * scale, 4, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      //yellow circle in entity's geometric center
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(this.center.x * scale, this.center.y * scale, 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
    // TODO: re-implement or remove
    // build: function(def) {
    //   if (def.radius) {
    //     return new CircleEntity(def);
    //   } else if (def.points) {
    //     return new PolygonEntity(def);
    //   } else if (def.img) {
    //     return new ImageEntity(def);
    //   }else {
    //     return new RectangleEntity(def);
    //   }
    // }
  });

});