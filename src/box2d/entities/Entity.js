/**
 * This represents a body and shape in a Box2d world using positions and sizes relative to the Box2d world instance.
 * @name Entity
 * @constructor Entity
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  'lodash'
], function(dcl, Mixer, _){

  'use strict';

  return dcl(Mixer, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf Entity#
     * @default
     */
    declaredClass: 'frozen/box2d/entities/Entity',
    /**
     * The id in which to reference this object. Also the userData property for box2d bodies.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    id: 0,
    /**
     * The x component of the entity's location
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    x: 0,
    /**
     * The y component of the entity's location
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    y: 0,
    /**
     * The scale in pixels per meter in which to represent this Entity in the box2d world
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    scale: null,
    /**
     * Fixes the rotation of the entity, no angular damping is applied
     * @type {Boolean}
     * @memberOf Entity#
     * @default
     */
    fixedRotation: false,
    /**
     * The current angle that this entity is rotated at
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    angle: 0,
    /**
     * The x and y locations of what box2d considers the enity's center of mass
     * @type {Point}
     * @memberOf Entity#
     * @default
     */
    center: null,
    /**
     * The percentage of force in which the entity will bounce back from another based on its force pre-collision
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    restitution: 0.3,
    /**
     * The two-dimensional density of the entity.  Mass / area.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    density: 1.0,
    /**
     * The amount of friction on th surface of this entity
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    friction: 0.9,
    /**
     * The amount of linear velocity the entity should lose over time
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    linearDamping: 0,
    /**
     * The velocity in meters/second given to this entity by box2d calculations
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    linearVelocity: null,
    /**
     * The angular velocity in radians/second given to this entity by box2d calculations
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    angularVelocity: 0,
    /**
     * The of amount of angular velocity an entity should lose over time
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    angularDamping: 0,
    /**
     * If true, the entity does change its position and angle as the result of box2d calculations
     * @type {Boolean}
     * @memberOf Entity#
     * @default
     */
    staticBody: false,
    /**
     * The fillStyle to use for the entity's default renderer
     * @type {String}
     * @memberOf Entity#
     * @default
     */
    fillStyle: 'rgba(128,128,128,0.5)',
    /**
     * The strokeStyle to use for the entity's default renderer
     * @type {String}
     * @memberOf Entity#
     * @default
     */
    strokeStyle: '#000',
    /**
     * The line width to use for the entity's default renderer
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    lineWidth: 1,
    /**
     * The 16 bit integer used in determining which other types of entities this body will collide with.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    maskBits: null,
    /**
     * The 16 bit integer used in describing the type that this enitity is for collisions.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    categoryBits: null,
    /**
     * The 16 bit integer used in overiding maskBits and categoryBits for collision detection.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    groupIndex: null,
    /**
     * Whether the entity is a sensor
     * @type {Boolean}
     * @memberOf Entity#
     * @default
     */
    sensor: false,

    /**
     * Update this entity with the state passed in
     * @function
     * @memberOf Entity#
     * @param {Object} state State to merge with this object
     */
    update: function(state){
      _.assign(this, state);
    },

    /**
     * Draws the Entity at a given scale
     * @function
     * @memberOf Entity#
     * @param {Context} ctx The HTML5 2d drawing context
     * @param {Number} scale The scale to draw the entity at
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
     * @function
     * @memberOf Entity#
     * @param {Number} scale The scale to multiply the dimentions by
     */
    scaleShape: function(scale){
      this.x = this.x * scale;
      this.y = this.y * scale;
      this.alreadyScaled = true;
    }

  });

});
