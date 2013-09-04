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
    it('should  have properties of Circle, Rectangle, Polygon, and MultiPolygon defined', function(){
      var keys = Object.keys(entities);
      expect(keys.length).toBe(expectedKeys.length);
      Object.keys(entities).forEach(function(key){
        expect(expectedKeys).toContain(key);
      });
    });

    it('should not have a fixed rotation', function(){
      [Circle, Rectangle, Polygon, MultiPolygon].forEach(function(Key){
        var keyObject = new Key();
        expect(keyObject.fixedRotation).toBeFalsy();
        expect(keyObject.fixedRotation).not.toBeTruthy();
      });
    });

    it('should have a fixed rotation', function(){
      [Circle, Rectangle, Polygon, MultiPolygon].forEach(function(Key){
        var keyObject = new Key({fixedRotation: true});
        expect(keyObject.fixedRotation).toBeTruthy();
        expect(keyObject.fixedRotation).not.toBeFalsy();
      });
    });
  });


});
