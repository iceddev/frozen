define([
  'frozen/utils/degreesToRadians'
], function(degreesToRadians){

  'use strict';


  describe('Degrees To Radians', function(){
    it('should return the value of 180 degrees', function(){
      var angle = degreesToRadians(180);
      expect(angle).toEqual(Math.PI);
    });

    it('should return the value of 0 degress', function(){
      var angle = degreesToRadians(0);
      expect(angle).toEqual(0);
    });

    it('should return the value of null degress', function(){
      var angle = degreesToRadians(null);
      expect(angle).toEqual(0);
    });

    it('should return the value of a non numerical argument', function(){
      var angle = degreesToRadians('adfs');
      expect(isNaN(angle)).toEqual(true);
    });


  });

});