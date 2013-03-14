define([
  'frozen/utils/distance'
], function(distance){

  'use strict';

  var pt1 = {x: 0, y: 0};
  var pt2 = {x: 0, y: 1};
  var pt3 = {x: -1, y: 0};

  describe('Distance', function(){
    it('should return the distance between 2 points', function(){
      var dist = distance(pt1, pt2);
      expect(dist).toEqual(1);
    });

    it('should return the distance between 2 other points', function(){
      var dist = distance(pt1, pt3);
      expect(dist).toEqual(1);
    });

    it('should throw an exception with a missing arugments', function(){
      expect(function(){distance(pt1);}).toThrow();
    });

    it('should return NaN on invalid arument types', function(){
      var dist = distance(1,'a');
      expect(isNaN(dist)).toEqual(true);
    });



  });

});