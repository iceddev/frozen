(function(global, define){
  'use strict';

  define(function(require){

    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for(var x = 0; x < vendors.length && !global.AudioContext; ++x) {
      global.AudioContext = global[vendors[x]+'AudioContext'];
    }

  });

}(
  /* jshint eqeqeq: false, strict: false */
  typeof global == 'object' ? global : this.window || this.global,
  typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
  // Boilerplate for AMD and Node
));
