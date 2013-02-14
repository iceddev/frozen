define([
  'frozen/utils/averagePoints'
], function(averagePoints){

  'use strict';

  var points = [{x: 10, y: 10},{x: 20, y: 20},{x: 30, y: 30},{x: 60, y: 60}];

  var badPoints = [{},[],2, '', false];

  describe('Average Points', function(){
    it('should return the average x and y values', function(){
      var avg = averagePoints(points);
      expect(avg.x).toEqual(30);
      expect(avg.y).toEqual(30);
    });

    it('should throw an exception if point is null', function(){
      expect(function(){averagePoints(null);}).toThrow();
    });

    it('should return NaN for x and y on an empty array', function(){
      var avg = averagePoints([]);
      expect(isNaN(avg.x)).toBe(true);
      expect(isNaN(avg.y)).toBe(true);
    });


    it('should return NaN for x and y on an array objects that aren\'t points', function(){
      var avg = averagePoints(badPoints);
      expect(isNaN(avg.x)).toBe(true);
      expect(isNaN(avg.y)).toBe(true);
    });

  });

});