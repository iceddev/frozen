define([
  'frozen/utils/insideCanvas'
], function(insideCanvas){

  'use strict';

  var inPoint = {x: 10, y: 10};
  var outPoint = {x: -10, y: 1000};
  var mockCanvas = {height: 150, width: 300};

  describe('Insde Canvas', function(){

    it('check if a point is inside the canvas', function(){
      expect(insideCanvas(inPoint, mockCanvas)).toEqual(true);
    });

    it('check if a point is outside the canvas', function(){
      expect(insideCanvas(outPoint, mockCanvas)).toEqual(false);
    });

    it('check for exception if missing an argument', function(){
      expect(function(){insideCanvas(inPoint);}).toThrow();
    });

    it('check if for invalid types passed in', function(){
      expect(insideCanvas(1, 'a')).toEqual(true);
    });

  });


});