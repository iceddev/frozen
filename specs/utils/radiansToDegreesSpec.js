define([
  'frozen/utils/radiansToDegrees'
], function(radiansToDegrees){

  'use strict';


  describe('Radians To Degrees', function(){
    it('should return the value of 180 degrees', function(){
      var angle = radiansToDegrees(Math.PI);
      expect(angle).toEqual(180);
    });

    it('should return the value of 0 degress', function(){
      var angle = radiansToDegrees(0);
      expect(angle).toEqual(0);
    });

    it('should return the value of null degress', function(){
      var angle = radiansToDegrees(null);
      expect(angle).toEqual(0);
    });

    it('should return the value of a non numerical argument', function(){
      var angle = radiansToDegrees('adfs');
      expect(isNaN(angle)).toEqual(true);
    });


  });

});