define([
  'frozen/utils/radiansFromCenter'
], function(radiansFromCenter){

  'use strict';

  var origin = {x: 0, y: 0};
  var pt1 = {x: 1, y: 1};
  var pt2 = {x: -1, y: -1};
  var pt3 = {x: 0, y: -1};

  describe('Degrees From Center', function(){
    it('check the angle in radians from the origin to a point in the lower right', function(){
      var angle = radiansFromCenter(origin, pt1);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toBeGreaterThan(0.75 * Math.PI - 0.1);
      expect(angle).toBeLessThan(0.75 * Math.PI + 0.1);
    });

    it('check the angle in radians from the origin to a point in the upper left', function(){
      var angle = radiansFromCenter(origin, pt2);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toBeGreaterThan(1.75 * Math.PI - 0.1);
      expect(angle).toBeLessThan(1.75 * Math.PI + 0.1);
    });

    it('check the angle in radians from on the same point', function(){
      var angle = radiansFromCenter(pt1, pt1);
      expect(angle).toEqual(0);
    });

    it('check the angle in radians from the origin to a point directly above it', function(){
      var angle = radiansFromCenter(origin, pt3);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toEqual(0);
    });


    it('check the angle in radians from a null center', function(){
      var angle = radiansFromCenter(null, pt1);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toBeGreaterThan(0.75 * Math.PI - 0.1);
      expect(angle).toBeLessThan(0.75 * Math.PI + 0.1);
    });


    it('check the angle in radians from a null point', function(){
      expect(function(){radiansFromCenter(origin, null);}).toThrow();
    });


  });


});