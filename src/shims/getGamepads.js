define(function(){

  'use strict';

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !navigator.GetGamepads; ++x) {
    navigator.GetGamepads = navigator[vendors[x]+'GetGamepads'];
  }

});