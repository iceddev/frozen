define(function(){

  'use strict';

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !navigator.getGamepads; ++x) {
    navigator.getGamepads = navigator[vendors[x]+'GetGamepads'];
  }

});