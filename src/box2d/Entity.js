/**
 * This represents a body and shape in a Box2d world using positions and sizes relative to the Box2d world instance.
 * @name Entity
 * @class Entity
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang'
], function(dcl, Mixer, lang){

  'use strict';

  return dcl(Mixer, {
    id: 0,
    x: 0,
    y: 0,
    scale: null,
    angle: 0,
    center: null,
    restitution: 0.3,
    density: 1.0,
    friction: 0.9,
    linearDamping: 0,
    linearVelocity: null,
    angularVelocity: 0,
    angularDamping: 0,
    staticBody: false,
    color: 'rgba(128,128,128,0.5)',
    strokeColor: '#000',
    lineWidth: 1,
    hidden: false,
    /* Used for collision filtering */
    maskBits: null,
    categoryBits: null,
    groupIndex: null,

    update: function(state){
      lang.mixin(this, state);
    },

    /**
      * Draws the Entity at a given scale
      * @name Entity#draw
      * @function
      * @param {2dContext} ctx the HTML5 2d drawing context
      * @param {Number} scale the scale to draw the entity at
    */
    draw: function(ctx, scale){
      scale = scale || this.scale || 1;
      var ogLineWidth = ctx.lineWidth;
      ctx.lineWidth = this.lineWidth;
      // black circle in entity's location
      ctx.fillStyle = this.strokeColor;
      ctx.beginPath();
      ctx.arc(this.x * scale, this.y * scale, 4, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      // yellow circle in entity's geometric center
      if(this.center){
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.center.x * scale, this.center.y * scale, 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }

      ctx.lineWidth = ogLineWidth;
    },

    /**
      * Scales the position and dimensions of this shape.
      * @name Entity#scaleShape
      * @function
      * @param {Number} scale the scale to multiply the dimentions by
    */
    scaleShape: function(scale){
      this.x = this.x * scale;
      this.y = this.y * scale;
      this.alreadyScaled = true;
    }

  });

});