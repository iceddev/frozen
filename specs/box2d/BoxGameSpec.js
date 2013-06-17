define([
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities/Rectangle',
  'frozen/box2d/joints/Revolute'
], function(BoxGame, Rectangle, Revolute){

  'use strict';

  describe('BoxGame', function(){

    var game;
    var rect;
    var rect2;
    var joint;
    var joint2;

    beforeEach(function(){

      game = new BoxGame({
        canvas: document.createElement('canvas')
      });

      var rectJSON = {id: 'a', halfHeight: 5, halfWidth: 10, staticBody: false, x: 0, y: 0};
      var rectJSON2 = {id: 'b', halfHeight: 10, halfWidth: 5, staticBody: false, x: 0, y: 0};
      rect = new Rectangle(rectJSON);
      rect2 = new Rectangle(rectJSON2);

      var jointJSON = {id: 'j1', bodyId1: rect.id, bodyId2: rect2.id};
      var jointJSON2 = {id: 'j2', bodyId1: rect.id, bodyId2: rect2.id};
      joint = new Revolute(jointJSON);
      joint2 = new Revolute(jointJSON2);
    });

    afterEach(function(){
      game.stop();
    });

    it('should have an entities object by default', function(){
      expect(game.entities).not.toBeNull();
    });

    it('should have a joints object by default', function(){
      expect(game.joints).not.toBeNull();
    });

    it('should have a box object by default', function(){
      expect(game.box).not.toBeNull();
    });

    it('should have the box updating default', function(){
      expect(game.boxUpdating).toEqual(true);
    });

    it('should have functions defined', function(){
      expect(game.beforeUpdate).toBeDefined();
      expect(game.addBody).toBeDefined();
      expect(game.removeBody).toBeDefined();
      expect(game.addJoint).toBeDefined();
      expect(game.removeJoint).toBeDefined();
    });

    describe('Single Add & Removes', function(){

      beforeEach(function(){
        game.addBody(rect);
        game.addBody(rect2);
        game.addJoint(joint);
      });

      describe('BoxGame.addBody()', function(){

        it('should add a body to the box', function(){
          expect(game.entities[rect.id]).toBeDefined();
          expect(game.entities[rect.id]).toBe(rect);
        });

      });

      describe('BoxGame.removeBody()', function(){

        it('should remove a body from the box', function(){
          game.removeBody(rect);
          expect(game.entities[rect.id]).not.toBeDefined();
        });

      });

      describe('BoxGame.addJoint()', function(){

        it('should add a joint to the box', function(){
          expect(game.joints[joint.id]).toBeDefined();
          expect(game.joints[joint.id]).toBe(joint);
        });

      });

      describe('BoxGame.removeJoint()', function(){

        it('should remove a joint from the box', function(){
          game.removeJoint(joint);
          expect(game.joints[joint.id]).not.toBeDefined();
        });

      });

    });

    describe('Multi Add & Removes', function(){
      var bodies;
      var joints;

      beforeEach(function(){
        bodies = [rect, rect2];
        joints = [joint, joint2];
      });

      describe('BoxGame.addBodies()', function(){

        it('should take an array and add bodies to the box', function(){
          game.addBodies(bodies);
          expect(game.entities[rect.id]).toBeDefined();
          expect(game.entities[rect2.id]).toBeDefined();
          expect(game.entities[rect.id]).toBe(rect);
          expect(game.entities[rect2.id]).toBe(rect2);
        });

        it('should take any arguments and add bodies to the box', function(){
          game.addBodies(rect, rect2);
          expect(game.entities[rect.id]).toBeDefined();
          expect(game.entities[rect2.id]).toBeDefined();
          expect(game.entities[rect.id]).toBe(rect);
          expect(game.entities[rect2.id]).toBe(rect2);
        });

      });

      describe('BoxGame.removeBodies()', function(){

        it('should take an array and remove bodies from the box', function(){
          game.addBodies(bodies);
          game.removeBodies(bodies);
          expect(game.entities[rect.id]).not.toBeDefined();
          expect(game.entities[rect2.id]).not.toBeDefined();
        });

        it('should take any arguments and remove bodies from the box', function(){
          game.addBodies(bodies);
          game.removeBodies(rect, rect2);
          expect(game.entities[rect.id]).not.toBeDefined();
          expect(game.entities[rect2.id]).not.toBeDefined();
        });

      });

      describe('BoxGame.addJoints()', function(){

        it('should take an array and add joints to the box', function(){
          game.addJoints(joints);
          expect(game.joints[joint.id]).toBeDefined();
          expect(game.joints[joint2.id]).toBeDefined();
          expect(game.joints[joint.id]).toBe(joint);
          expect(game.joints[joint2.id]).toBe(joint2);
        });

        it('should take any arguments and add joints to the box', function(){
          game.addJoints(joint, joint2);
          expect(game.joints[joint.id]).toBeDefined();
          expect(game.joints[joint2.id]).toBeDefined();
          expect(game.joints[joint.id]).toBe(joint);
          expect(game.joints[joint2.id]).toBe(joint2);
        });

      });

      describe('BoxGame.removeJoints()', function(){

        it('should take an array and remove joints from the box', function(){
          game.addJoints(joints);
          game.removeJoints(joints);
          expect(game.joints[joint.id]).not.toBeDefined();
          expect(game.joints[joint2.id]).not.toBeDefined();
        });

        it('should take any arguments and remove joints from the box', function(){
          game.addJoints(joints);
          game.removeJoints(joint, joint2);
          expect(game.joints[joint.id]).not.toBeDefined();
          expect(game.joints[joint2.id]).not.toBeDefined();
        });

      });

    });

  });

});