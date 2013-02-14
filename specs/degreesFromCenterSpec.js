define([
  'frozen/utils/degreesFromCenter'
], function(degreesFromCenter){

  'use strict';

  var origin = {x: 0, y: 0};
  var pt1 = {x: 1, y: 1};
  var pt2 = {x: -1, y: -1};
  var pt3 = {x: 0, y: -1};

  describe('Degrees From Center', function(){
    it('check the angle in degrees from the origin to a point in the lower right', function(){
      var angle = degreesFromCenter(origin, pt1);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toBeGreaterThan(134.9);
      expect(angle).toBeLessThan(135.1);
    });

    it('check the angle in degrees from the origin to a point in the upper left', function(){
      var angle = degreesFromCenter(origin, pt2);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toBeGreaterThan(314.9);
      expect(angle).toBeLessThan(315.1);
    });

    it('check the angle in degrees from on the same point', function(){
      var angle = degreesFromCenter(pt1, pt1);
      expect(angle).toEqual(0);
    });

    it('check the angle in degrees from the origin to a point directly above it', function(){
      var angle = degreesFromCenter(origin, pt3);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toEqual(0);
    });


    it('check the angle in degrees from a null center', function(){
      var angle = degreesFromCenter(null, pt1);
      //use small range to deal with floating point errors inherint to PI calculations
      expect(angle).toBeGreaterThan(134.9);
      expect(angle).toBeLessThan(135.1);
    });


    it('check the angle in degrees from a null point', function(){
      expect(function(){degreesFromCenter(origin, null);}).toThrow();
    });


  });


});