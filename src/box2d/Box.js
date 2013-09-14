/**
 * This wraps the box2d world that contains bodies, shapes, and performs the physics calculations.
 * @name Box
 * @constructor Box
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './listeners/Contact'
], function(dcl, Mixer, Contact){

  'use strict';

  // box2d globals
  var B2Vec2 = Box2D.Common.Math.b2Vec2;
  var B2BodyDef = Box2D.Dynamics.b2BodyDef;
  var B2Body = Box2D.Dynamics.b2Body;
  var B2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var B2Fixture = Box2D.Dynamics.b2Fixture;
  var B2World = Box2D.Dynamics.b2World;
  var B2MassData = Box2D.Collision.Shapes.b2MassData;
  var B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var B2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  var B2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  return dcl(Mixer, {
    /**
     * The number of cycles per second expected in update calcuations
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    intervalRate: 60,
    /**
     * Whether or not to try to compensate calculations based on performance
     * @type {Boolean}
     * @memberOf Box#
     * @default
     */
    adaptive: false,
    /**
     * A map of the bodies in the box2d world referenced by their given userData
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    bodiesMap: null,
    /**
     * A map of the fixtures in the box2d world referenced by their given userData
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    fixturesMap: null,
    /**
     * A map of the joints in the box2d world referenced by their given userData
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    jointsMap: null,
    /**
     * The instance of the Box2D.Dynamics.b2World world class that the bodies, fixtures, and joints are used in.
     * @type {B2World}
     * @memberOf Box#
     * @default
     */
    b2World: null,
    /**
     * The x component of the b2World's gravity in meters/second squared
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    gravityX: 0,
    /**
     * The y component of the b2World's gravity in meters/second squared
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    gravityY: 9.8,
    /**
     * Allow box2d to skip physics calculations on bodies at rest for performance
     * @type {Boolean}
     * @memberOf Box#
     * @default
     */
    allowSleep: true,
    /**
     * Whether to add a listener to collision events. Default behavior adds collision data to entities on update cycle
     * @type {Boolean}
     * @memberOf Box#
     * @default
     */
    resolveCollisions: false,
    /**
     * A contact listener for callbacks on collision events. Default is this box itself.
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    contactListener: null,
    /**
     * Map of collisions. Instantiated in update if resolveCollisions is true
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    collisions: null,
    /**
     * The number of pixels that represnt one meter in the box2d world. (30 pixels ~ 1 meter in box2d)
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    scale: 30,

    constructor: function(args){
      if(args && args.intervalRate){
        this.intervalRate = parseInt(args.intervalRate, 10);
      }
      this.bodiesMap = {};
      this.fixturesMap = {};
      this.jointsMap = {};

      this.b2World = new B2World(new B2Vec2(this.gravityX, this.gravityY), this.allowSleep);

      if(this.resolveCollisions){
        this.contactListener = new Contact();
      }

      if(this.contactListener){
        this.addContactListener(this.contactListener);
      }
    },

    /**
     * Update the box2d physics calculations
     * @function
     * @memberOf Box#
     * @param  {Number} millis The milliseconds used to determine framerate for box2d step
     * @return {Number} The amount of milliseconds the update took
     */
    update: function(millis) {
      // TODO: use window.performance.now()???

      if(this.contactListener && this.contactListener.reset){
        this.contactListener.reset();
      }

      var start = Date.now();
      if(millis){
        this.b2World.Step(millis / 1000 /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
        this.b2World.ClearForces();
      }else{
        var stepRate = (this.adaptive) ? (start - this.lastTimestamp) / 1000 : (1 / this.intervalRate);
        this.b2World.Step(stepRate /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
        this.b2World.ClearForces();
      }

      return (Date.now() - start);
    },

    /**
     * Gets the current state of the objects in the box2d world.
     * @function
     * @memberOf Box#
     * @return {Object} The state of the box2d world
     */
    getState: function() {
      var state = {};
      for (var b = this.b2World.GetBodyList(); b; b = b.m_next) {
        if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() !== null) {
          state[b.GetUserData()] = {
            x: b.GetPosition().x,
            y: b.GetPosition().y,
            angle: b.GetAngle(),
            center: {
              x: b.GetWorldCenter().x,
              y: b.GetWorldCenter().y
            },
            linearVelocity: b.m_linearVelocity,
            angularVelocity: b.m_angularVelocity
          };
          if(this.contactListener && this.contactListener.collisions){
            state[b.GetUserData()].collisions = this.contactListener.collisions[b.GetUserData()] || null;
          }
        }
      }
      return state;
    },

    /**
     * Updates the state in the Entity objects that are modified by box2d calculations.
     * @function
     * @memberOf Box#
     * @param {Object|Array} entities An array or map of Entity objects
     */
    updateExternalState: function(entities){
      //update the dyanmic shapes with box2d calculations
      var bodiesState = this.getState();
      for (var id in bodiesState) {
        var entity = entities[id];
        //update any dynamic bodies
        if (entity && !entity.staticBody){
          entity.update(bodiesState[id]);
        }
      }
    },

    /**
     * Add a map of entities to the Box
     * @function
     * @memberOf Box#
     * @param {Object} bodyEntities Map of entities
     */
    setBodies: function(bodyEntities) {
      for(var id in bodyEntities) {
        var entity = bodyEntities[id];
        this.addBody(entity);
      }
      this.ready = true;
    },

    /**
     * Add an Entity to the box2d world which will internally be converted to a box2d body and fixture (auto scaled with Box's scale property if the entity hasn't been scaled yet)
     * @function
     * @memberOf Box#
     * @param {Entity} entity Any Entity object
     */
    addBody: function(entity) {
      /*jshint eqnull:true */

      if(!entity.alreadyScaled){
        entity.scaleShape(1 / this.scale);
        entity.scale = this.scale;
      }

      var bodyDef = new B2BodyDef();
      var fixDef = new B2FixtureDef();
      var i,j,points,vec,vecs;
      fixDef.restitution = entity.restitution;
      fixDef.density = entity.density;
      fixDef.friction = entity.friction;
      fixDef.isSensor = entity.sensor || false;

      //these three props are for custom collision filtering
      if(entity.maskBits != null){
        fixDef.filter.maskBits = entity.maskBits;
      }
      if(entity.categoryBits != null){
        fixDef.filter.categoryBits = entity.categoryBits;
      }
      if(entity.groupIndex != null){
        fixDef.filter.groupIndex = entity.groupIndex;
      }

      if(entity.staticBody){
        bodyDef.type =  B2Body.b2_staticBody;
      } else {
        bodyDef.type = B2Body.b2_dynamicBody;
      }

      bodyDef.position.x = entity.x;
      bodyDef.position.y = entity.y;
      bodyDef.userData = entity.id;
      bodyDef.angle = entity.angle;
      bodyDef.linearDamping = entity.linearDamping;

      if(entity.fixedRotation){
        bodyDef.fixedRotation = true;
      } else {
        bodyDef.angularDamping = entity.angularDamping;
      }

      var body = this.b2World.CreateBody(bodyDef);

      if (entity.radius) { //circle
        fixDef.shape = new B2CircleShape(entity.radius);
        body.CreateFixture(fixDef);
      } else if (entity.points) { //polygon
        points = [];
        for (i = 0; i < entity.points.length; i++) {
          vec = new B2Vec2();
          vec.Set(entity.points[i].x, entity.points[i].y);
          points[i] = vec;
        }
        fixDef.shape = new B2PolygonShape();
        fixDef.shape.SetAsArray(points, points.length);
        body.CreateFixture(fixDef);
      } else if(entity.polys) { //complex object
          for (j = 0; j < entity.polys.length; j++) {
              points = entity.polys[j];
              vecs = [];
              for (i = 0; i < points.length; i++) {
                  vec = new B2Vec2();
                  vec.Set(points[i].x, points[i].y);
                  vecs[i] = vec;
              }
              fixDef.shape = new B2PolygonShape();
              fixDef.shape.SetAsArray(vecs, vecs.length);
              body.CreateFixture(fixDef);
          }
      } else { //rectangle
        fixDef.shape = new B2PolygonShape();
        fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
        body.CreateFixture(fixDef);
      }


      this.bodiesMap[entity.id] = body;
    },

    /**
     * Set the position of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} x The new x coordinate in box2d space
     * @param {Number} y The new y coordinate in box2d space
     */
    setPosition: function(bodyId, x, y){
      var body = this.bodiesMap[bodyId];
      body.SetPosition(new B2Vec2(x, y));
    },

    /**
     * Set the angle of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} angle The new angle of the body in radians
     */
    setAngle: function(bodyId, angle){
      var body = this.bodiesMap[bodyId];
      body.SetAngle(angle);
    },

    /**
     * Set the linear velocity of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} x The new x component of the velocity
     * @param {Number} y The new y component of the velocity
     */
    setLinearVelocity: function(bodyId, x, y){
      var body = this.bodiesMap[bodyId];
      body.SetLinearVelocity(new B2Vec2(x, y));
    },

    /**
     * Set the angular velocity of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} velocity The angular velocity for the body
     */
    setAngularVelocity: function(bodyId, velocity){
      var body = this.bodiesMap[bodyId];
      body.SetAngularVelocity(velocity);
    },

    /**
     * Apply an impulse to a body at an angle in degrees
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} degrees The angle in which to apply the impulse.
     * @param {Number} power The impulse power.
     */
    applyImpulseDegrees: function(bodyId, degrees, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyImpulse(
        new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
        Math.cos(degrees * (Math.PI / 180)) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply a force to a body at an angle in degrees
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} degrees The angle in which to apply the force.
     * @param {Number} power The power of the force. (The ability to destroy a planet is insignificant next to this)
     */
    applyForceDegrees: function(bodyId, degrees, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyForce(
        new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
        Math.cos(degrees * (Math.PI / 180)) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply an impulse to a body at an angle in radians
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} radians The angle in which to apply the impulse.
     * @param {Number} power The impulse power.
     */
    applyImpulse: function(bodyId, radians, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyImpulse(
        new B2Vec2(Math.sin(radians) * power,
        Math.cos(radians) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply a force to a body at an angle in radians
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} radians The angle in which to apply the force.
     * @param {Number} power The power of the force. (The ability to destroy a planet is insignificant next to this)
     */
    applyForce: function(bodyId, radians, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyForce(
        new B2Vec2(Math.sin(radians) * power,
        Math.cos(radians) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply torque (rotation force) to a body.
     * Positive values are clockwise, negative values are counter-clockwise.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} power The power of the torque.
     */
    applyTorque: function(bodyId, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyTorque(power);
    },

    /**
     * Sets the world's gravity
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Object} vector An object with x and y values in meters per second squared.
     */
    setGravity: function(vector) {
      this.b2World.SetGravity(new B2Vec2(vector.x, vector.y));
    },

    /**
     * Remove a body from the box2d world
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     */
    removeBody: function(id) {
      if(this.bodiesMap[id]){
        if(this.fixturesMap[id]){
          this.bodiesMap[id].DestroyFixture(this.fixturesMap[id]);
        }
        this.b2World.DestroyBody(this.bodiesMap[id]);
        //delete this.fixturesMap[id];
        delete this.bodiesMap[id];
      }
    },

    /**
     * Wake up a body in the box2d world so that box2d will continue to run calculations on it.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     */
    wakeUpBody: function(id) {
      if(this.bodiesMap[id]){
        this.bodiesMap[id].SetAwake(true);
      }
    },

    /**
     * Add a contactListener to the b2World
     * @function
     * @memberOf Box#
     * @param {Object} callbacks Object containing a beginContant, endContact and/or preSolve/postSolve keys and callbacks
     */
    addContactListener: function(contactListener){
      var listener = new Box2D.Dynamics.b2ContactListener();
      if(contactListener.beginContact){
        listener.BeginContact = function(contact){
          contactListener.beginContact(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, contact);
        };
      }
      if(contactListener.endContact){
        listener.EndContact = function(contact){
          contactListener.endContact(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, contact);
        };
      }
      if(contactListener.preSolve){
        listener.PreSolve = function(contact, oldManifold){
          contactListener.preSolve(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, oldManifold, contact);
        };
      }
      if (contactListener.postSolve){
        listener.PostSolve = function(contact, impulse){
          contactListener.postSolve(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, impulse, contact);
        };
      }
      this.b2World.SetContactListener(listener);
    },

    /**
     * Remove a joint from the world.
     *
     * This must be done outside of the update() iteration, and BEFORE any bodies connected to the joint are removed!
     *
     * @function
     * @memberOf Box#
     * @param {Number} jointId The id of joint to be destroyed.
     */
    removeJoint: function(jointId) {
      if(this.jointsMap[jointId]){
        this.b2World.DestroyJoint(this.jointsMap[jointId]);
        delete this.jointsMap[jointId];
      }
    },

    /**
     * Add a joint to the box2d world.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Joint} A joint definition.
     */
    addJoint: function(joint) {
      if(joint && joint.id && !this.jointsMap[joint.id]){

        if(!joint.alreadyScaled && joint.scaleJointLocation){
          joint.scaleJointLocation(1 / this.scale);
          joint.scale = this.scale;
        }

        var b2Joint = joint.createB2Joint(this);
        if(b2Joint){
          this.jointsMap[joint.id] = b2Joint;
        }
      }
    }
  });

});
