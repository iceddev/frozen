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

dojo.provide("mwe.box2d.Box");

/**

This holds the state of the box2d world and has convenience methods to easily create and manipulate it.

The box2dweb library ( http://code.google.com/p/box2dweb ) must be included before requiring this module

*/


// box2d globals
var   b2Vec2 = Box2D.Common.Math.b2Vec2
, b2BodyDef = Box2D.Dynamics.b2BodyDef
, b2Body = Box2D.Dynamics.b2Body
, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
, b2Fixture = Box2D.Dynamics.b2Fixture
, b2World = Box2D.Dynamics.b2World
, b2MassData = Box2D.Collision.Shapes.b2MassData
, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
, b2DebugDraw = Box2D.Dynamics.b2DebugDraw;



dojo.declare("mwe.box2d.Box",null,{
	intervalRate : 60,
	adaptive : false,
	width : 640,
	height : 480,
	scale : 30,
	bodiesMap : null,
	world : null,
	gravityX : 0,
	gravityY: 10,
	allowSleep: true,

    constructor: function(args){
		dojo.safeMixin(this, args);
		if(args.intervalRate){
			this.intervalRate = parseInt(args.intervalRate);
		}
		
		if(!this.bodiesMap){
			this.bodiesMap = [];
		}
		
		this.world = new b2World(
		        new b2Vec2(this.gravityX, this.gravityY)    
		     ,  this.allowSleep                 
		);
		
    },
    
    update : function() {
	  var start = Date.now();
	  var stepRate = (this.adaptive) ? (now - this.lastTimestamp) / 1000 : (1 / this.intervalRate);
	  this.world.Step(
	         stepRate   //frame-rate
	      ,  10       //velocity iterations
	      ,  10       //position iterations
	   );
	   this.world.ClearForces();
	   return (Date.now() - start);
	},
	
	getState : function() {
	  var state = {};
	  for (var b = this.world.GetBodyList(); b; b = b.m_next) {
	    if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
	        state[b.GetUserData()] = {x: b.GetPosition().x, y: b.GetPosition().y, angle: b.GetAngle(), center: {x: b.GetWorldCenter().x, y: b.GetWorldCenter().y}};
	    }
	  }
	  return state;
	},
	
	setBodies : function(bodyEntities) {
	    console.log('bodies',bodyEntities);
	    for(var id in bodyEntities) {
	        var entity = bodyEntities[id];
	        this.addBody(entity);
	    }
	    this.ready = true;
	},
	
	addBody : function(entity) {
		var bodyDef = new b2BodyDef();
	    var fixDef = new b2FixtureDef();
	    fixDef.restitution = entity.restitution;
	    fixDef.density = entity.density;
	    fixDef.friction = entity.friction;
	    
	    
	    if(entity.staticBody){
	    	bodyDef.type =  b2Body.b2_staticBody;
	    }else{
	    	bodyDef.type = b2Body.b2_dynamicBody;
	    }
	    
	    
	    if (entity.radius) {
	        fixDef.shape = new b2CircleShape(entity.radius);
	    } else if (entity.points) {
	        var points = [];
	        for (var i = 0; i < entity.points.length; i++) {
	            var vec = new b2Vec2();
	            vec.Set(entity.points[i].x, entity.points[i].y);
	            points[i] = vec;
	        }
	        fixDef.shape = new b2PolygonShape;
	        fixDef.shape.SetAsArray(points, points.length);
	    } else {
	        fixDef.shape = new b2PolygonShape;
	        fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
	    }
	   bodyDef.position.x = entity.x;
	   bodyDef.position.y = entity.y;
	   bodyDef.userData = entity.id;
	   bodyDef.linearDamping = entity.linearDamping;
	   bodyDef.angularDamping = entity.angularDamping;
	   this.bodiesMap[entity.id] = this.world.CreateBody(bodyDef);
	   this.bodiesMap[entity.id].CreateFixture(fixDef);	    
	    
	},
	
	applyImpulse : function(bodyId, degrees, power) {
		//console.log('bodiesMap',this.bodiesMap);
	    var body = this.bodiesMap[bodyId];
	    body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
	                                 Math.sin(degrees * (Math.PI / 180)) * power),
	                                 body.GetWorldCenter());
	    console.log('applying impluse',bodyId, degrees, power);
	},
	
	removeBody : function(id) {
		if(this.bodiesMap[id]){
			this.world.DestroyBody(this.bodiesMap[id]);
			
		}
	}
	
    
    
    
});
