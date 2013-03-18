define([
  'frozen/box2d/entities'
], function(entities){

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
  });


});