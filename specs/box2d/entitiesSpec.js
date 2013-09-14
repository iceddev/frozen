define([
  'frozen/box2d/Box',
  'frozen/box2d/entities',
  'frozen/box2d/entities/Circle',
  'frozen/box2d/entities/Rectangle',
  'frozen/box2d/entities/Polygon',
  'frozen/box2d/entities/MultiPolygon'
], function(Box, entities, Circle, Rectangle, Polygon, MultiPolygon){

  'use strict';

  var expectedKeys = ['Circle', 'Rectangle', 'Polygon', 'MultiPolygon'];

  describe('entities', function(){
    var keys = Object.keys(entities);

    it('should  have properties of Circle, Rectangle, Polygon, and MultiPolygon defined', function(){
      expect(keys.length).toBe(expectedKeys.length);
      keys.forEach(function(key){
        expect(expectedKeys).toContain(key);
      });
    });

    it('should not have a fixed rotation', function(){
      keys.forEach(function(Entity){
        var entity = new entities[Entity]();
        expect(entity.fixedRotation).toBe(false);
      });
    });

    it('should have a fixed rotation', function(){
      keys.forEach(function(Entity){
        var entity = new entities[Entity]({
          fixedRotation: true
        });
        expect(entity.fixedRotation).toBe(true);
      });
    });
  });


});
