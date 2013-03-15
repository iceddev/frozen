define([
  'frozen/box2d/BoxGame',
  'frozen/box2d/RectangleEntity',
  'frozen/box2d/joints/Revolute'
], function(BoxGame, Rectangle, Revolute){

  'use strict';

  var rectJSON = {id: 'a', halfHeight: 5, halfWidth: 10, staticBody: false, x: 0, y: 0};
  var rectJSON2 = {id: 'b', halfHeight: 10, halfWidth: 5, staticBody: false, x: 0, y: 0};

  describe('BoxGame', function(){

    var game;

    beforeEach(function(){
      game = new BoxGame({
        canvas: document.createElement('canvas')
      });
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
      expect(game.preUpdate).toBeDefined();
      expect(game.addBody).toBeDefined();
      expect(game.removeBody).toBeDefined();
      expect(game.addJoint).toBeDefined();
      expect(game.removeJoint).toBeDefined();
    });

    describe('BoxGame.addBody()', function(){

      it('should add a body to the box', function(){
        var rect = new Rectangle(rectJSON);
        game.addBody(rect);
        expect(game.entities[rect.id]).toBeDefined();
      });

    });

    describe('BoxGame.removeBody()', function(){

      it('should remove a body from the box', function(){
        var rect = new Rectangle(rectJSON);
        game.addBody(rect);
        game.removeBody(rect);
        expect(game.entities[rect.id]).not.toBeDefined();
      });

    });


    describe('BoxGame.addJoint()', function(){

      it('should add a joint to the box', function(){
        var rect = new Rectangle(rectJSON);
        var rect2 = new Rectangle(rectJSON2);
        var joint = new Revolute({id: 'j1', bodyId1: rect.id, bodyId2: rect2.id});
        game.addBody(rect);
        game.addBody(rect2);
        game.addJoint(joint);
        expect(game.joints[joint.id]).toBeDefined();
      });

    });

    describe('BoxGame.removeJoint()', function(){

      it('should remove a joint from the box', function(){
        var rect = new Rectangle(rectJSON);
        var rect2 = new Rectangle(rectJSON2);
        var joint = new Revolute({id: 'j1', bodyId1: rect.id, bodyId2: rect2.id});
        game.addBody(rect);
        game.addBody(rect2);
        game.addJoint(joint);
        game.removeJoint(joint);
        expect(game.joints[joint.id]).not.toBeDefined();
      });

    });

  });

});