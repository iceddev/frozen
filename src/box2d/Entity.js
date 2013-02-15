/**
 * This represents a body and shape in a Box2d world using positions and sizes relative to the Box2d world instance.
 * @name Entity
 * @class Entity
 * @property {String} id The id in which to reference this object. Also the userData property for box2d bodies.
 * @property {Number} x The x component of the entity's location
 * @property {Number} y The y component of the entity's location
 * @property {Number} scale The scale in pixels per meter in which to represent this Entity in the box2d world
 * @property {Number} angle The current angle that this entity is rotated at
 * @property {Object} center The x and y locations of what box2d considers the enity's center of mass
 * @property {Number} restitution The percentage of force in which the entity will bounce back from another based on its force pre-collision
 * @property {Number} density The two-dimensional density of the entity.  Mass / area.
 * @property {Number} friction The amount of friction on th surface of this entity
 * @property {Number} linearDamping The amount of linear velocity the entity should lose over time
 * @property {Number} linearVelocity The velocity in meters/second given to this entity by box2d calculations
 * @property {Number} angularVelocity The angular velocity in radians/second given to this entity by box2d calculations
 * @property {Number} angularDamping The of amount of angular velocity an entity should lose over time
 * @property {Boolean} staticBody If true, the entity does change its position and angle as the result of box2d calculations
 * @property {String} fillStyle The fillStyle to use for the entity's default renderer
 * @property {String} strokeStyle The strokeStyle to use for the entity's default renderer
 * @property {Boolean} hidden (deprecated) whether to render this object
 * @property {Number} maskBits The 16 bit integer used in determining which other types of entities this body will collide with.
 * @property {Number} categoryBits The 16 bit integer used in describing the type that this enitity is for collisions.
 * @property {Number} groupIndex The 16 bit integer used in overiding maskBits and categoryBits for collision detection.
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
    fillStyle: 'rgba(128,128,128,0.5)',
    strokeStyle: '#000',
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
      ctx.fillStyle = this.strokeStyle;
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