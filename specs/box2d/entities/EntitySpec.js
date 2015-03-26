define([
  'frozen/box2d/Box',
  'frozen/box2d/entities/Entity'
], function(Box, Entity){

  'use strict';

  var entityJSON = {id: 'a', staticBody: false, x: 30, y: 30};

  describe('Entity', function(){

    it('has a unique default ID', function(){
      var entity1 = new Entity();
      var entity2 = new Entity();
      expect(entity1.id).not.toBe(entity2.id);
    });

    it('check defaults position', function(){
      var entity = new Entity();
      expect(entity.x).toBe(0);
      expect(entity.y).toBe(0);
    });

    it('check if entity can explicitly scale', function(){
      var entity = new Entity(entityJSON);
      var box = new Box();
      entity.scaleShape(2);
      box.addBody(entity);
      expect(entity.x).toBe(60);
      expect(entity.y).toBe(60);
    });

  });


});
