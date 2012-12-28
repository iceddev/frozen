define(function(){

  'use strict';

  return function(p1, p2){
    return Math.sqrt( ((p2.x - p1.x) * (p2.x - p1.x)) + ((p2.y - p1.y) * (p2.y - p1.y)) );
  };

});