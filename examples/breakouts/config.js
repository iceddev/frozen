(function(){

  'use strict';

  // This file is specific to loading with RequireJS

  requirejs.config({
    baseUrl: '../../deps',
    paths: {
      'domReady': 'requirejs-domready/domReady'
    },
    packages: [
      { name: 'dcl', location: 'dcl', main: 'dcl' },
      { name: 'lodash', location: 'lodash/modern' },
      { name: 'hammer', location: 'hammer/dist', main: 'hammer' },
      { name: 'on', location: 'frozen-on' },
      { name: 'frozen', location: 'frozen/src', main: 'GameCore' },
      { name: 'game', location: '../examples/breakouts/src', main: 'game' },
      { name: 'resources', location: '../examples/breakouts/resources' },
      { name: 'sounds', location: '../examples/breakouts/resources/sfx' }
    ]
  });

  function onsuccess(){
    requirejs(['game']);
  }

  // Handle errors - from http://requirejs.org/docs/api.html#errbacks
  function onerror(err){
    //The error has a list of modules that failed
    var failedId = err.requireModules && err.requireModules[0];
    requirejs.undef(failedId);
    onsuccess();
  }

  requirejs(['../dist/frozen'], onsuccess, onerror);

}());
