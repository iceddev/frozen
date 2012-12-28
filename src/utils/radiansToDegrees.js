define(function(){

  'use strict';

  var degConst = 180.0 / Math.PI;

  return function(radians){
    return radians * degConst;
  };

});