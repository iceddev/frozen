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
  'dojo/_base/declare'
], function(declare){

  // box2d globals

  var B2Vec2 = Box2D.Common.Math.b2Vec2
    , B2BodyDef = Box2D.Dynamics.b2BodyDef
    , B2Body = Box2D.Dynamics.b2Body
    , B2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , B2Fixture = Box2D.Dynamics.b2Fixture
    , B2World = Box2D.Dynamics.b2World
    , B2MassData = Box2D.Collision.Shapes.b2MassData
    , B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , B2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , B2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  return declare(null, {
    intervalRate: 60,
    adaptive: false,
    width: 640,
    height: 480,
    scale: 30,
    bodiesMap: [],
    fixturesMap: [],
    world: null,
    gravityX: 0,
    gravityY: 10,
    allowSleep: true,
    resolveCollisions: false,
    contactListener: null,
    collisions: null,
    constructor: function(args){
      declare.safeMixin(this, args);
      if(args.intervalRate){
        this.intervalRate = parseInt(args.intervalRate, 10);
      }

      this.world = new B2World(new B2Vec2(this.gravityX, this.gravityY), this.allowSleep);

      if(this.resolveCollisions){
        this.addContactListener(this.contactListener || this);
      }
    },
    update: function() {
      // TODO: use window.performance.now()???

      if(this.resolveCollisions){
        this.collisions = {};
      }

      var start = Date.now();
      var stepRate = (this.adaptive) ? (start - this.lastTimestamp) / 1000 : (1 / this.intervalRate);
      this.world.Step(stepRate /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
      this.world.ClearForces();
      return (Date.now() - start);
    },
    getState: function() {
      var state = {};
      for (var b = this.world.GetBodyList(); b; b = b.m_next) {
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
          if(this.resolveCollisions){
            state[b.GetUserData()].collisions = this.collisions[b.GetUserData()] || null;
          }
        }
      }
      return state;
    },
    updateExternalState: function(world){
      //update the dyanmic shapes with box2d calculations
      var bodiesState = this.getState();
      for (var id in bodiesState) {
        var entity = world[id];
        if (entity && !entity.staticBody){
          entity.update(bodiesState[id]);
        }
      }
    },
    setBodies: function(bodyEntities) {
      console.log('bodies',bodyEntities);
      for(var id in bodyEntities) {
        var entity = bodyEntities[id];
        this.addBody(entity);
      }
      this.ready = true;
    },
    addBody: function(entity) {
      var bodyDef = new B2BodyDef();
      var fixDef = new B2FixtureDef();
      fixDef.restitution = entity.restitution;
      fixDef.density = entity.density;
      fixDef.friction = entity.friction;

      if(entity.staticBody){
        bodyDef.type =  B2Body.b2_staticBody;
      } else {
        bodyDef.type = B2Body.b2_dynamicBody;
      }

      if (entity.radius) {
        fixDef.shape = new B2CircleShape(entity.radius);
      } else if (entity.points) {
        var points = [];
        for (var i = 0; i < entity.points.length; i++) {
          var vec = new B2Vec2();
          vec.Set(entity.points[i].x, entity.points[i].y);
          points[i] = vec;
        }
        fixDef.shape = new B2PolygonShape();
        fixDef.shape.SetAsArray(points, points.length);
      } else {
        fixDef.shape = new B2PolygonShape();
        fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
      }
      bodyDef.position.x = entity.x;
      bodyDef.position.y = entity.y;
      bodyDef.userData = entity.id;
      bodyDef.linearDamping = entity.linearDamping;
      bodyDef.angularDamping = entity.angularDamping;
      this.bodiesMap[entity.id] = this.world.CreateBody(bodyDef);
      this.fixturesMap[entity.id] = this.bodiesMap[entity.id].CreateFixture(fixDef);
    },
    setPosition: function(bodyId, x, y){
      var body = this.bodiesMap[bodyId];
      body.SetPosition(new B2Vec2(x, y));
    },
    applyImpulseDegrees : function(bodyId, degrees, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyImpulse(
        new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
        Math.cos(degrees * (Math.PI / 180)) * power * -1),
        body.GetWorldCenter()
      );
    },
    applyForceDegrees : function(bodyId, degrees, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyForce(
        new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
        Math.cos(degrees * (Math.PI / 180)) * power * -1),
        body.GetWorldCenter()
      );
    },
    applyImpulse : function(bodyId, radians, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyImpulse(
        new B2Vec2(Math.sin(radians) * power,
        Math.cos(radians) * power * -1),
        body.GetWorldCenter()
      );
    },
    applyForce : function(bodyId, radians, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyForce(
        new B2Vec2(Math.sin(radians) * power,
        Math.cos(radians) * power * -1),
        body.GetWorldCenter()
      );
    },
    applyTorque : function(bodyId, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyTorque(power);
    },
    removeBody: function(id) {
      if(this.bodiesMap[id]){
        this.bodiesMap[id].DestroyFixture(this.fixturesMap[id]);
        this.world.DestroyBody(this.bodiesMap[id]);
        delete this.fixturesMap[id];
        delete this.bodiesMap[id];
      }
    },
    addContactListener: function(callbacks) {
      var listener = new Box2D.Dynamics.b2ContactListener();
      if (callbacks.beginContact) {
        listener.BeginContact = function(contact) {
          callbacks.beginContact(contact.GetFixtureA().GetBody().GetUserData(),
                                 contact.GetFixtureB().GetBody().GetUserData());
          };
      }
      if (callbacks.EndContact){

        listener.endContact = function(contact) {
          callbacks.endContact(contact.GetFixtureA().GetBody().GetUserData(),
                               contact.GetFixtureB().GetBody().GetUserData());
        };
      }
      if (callbacks.postSolve){

        listener.PostSolve = function(contact, impulse) {
          callbacks.postSolve(contact.GetFixtureA().GetBody().GetUserData(),
                               contact.GetFixtureB().GetBody().GetUserData(),
                               impulse.normalImpulses[0]);
        };
      }
      this.world.SetContactListener(listener);
    },
    beginContact: function(idA, idB){

    },
    endContact: function(idA, idB){

    },
    postSolve: function(idA, idB, impulse){
      this.collisions[idA] = this.collisions[idA] || [];
      this.collisions[idA].push({id: idB, impulse: impulse});
      this.collisions[idB] = this.collisions[idB] || [];
      this.collisions[idB].push({id: idA, impulse: impulse});
    }
  });

});