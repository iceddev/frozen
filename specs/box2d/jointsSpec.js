define([
  'frozen/box2d/joints'
], function(joints){

  'use strict';

  var expectedKeys = ['Distance', 'Prismatic', 'Revolute'];

  describe('joints', function(){
    it('should have properties of Distance, Prismatic, and Revolute defined', function(){
      var keys = Object.keys(joints);
      expect(keys.length).toBe(expectedKeys.length);
      Object.keys(joints).forEach(function(key){
        expect(expectedKeys).toContain(key);
      });
    });
  });


});