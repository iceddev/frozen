define([
  'require',
  'dojo/has',
  '../shims/AudioContext'
], function(require, has){

  'use strict';

  has.add('WebAudio', function(global){
    return !!global.AudioContext;
  });

  return {
    load: function(id, parentRequire, loaded, config){
      require([has('WebAudio') ? './WebAudio' : './HTML5Audio'], function(Sound){
        loaded(Sound);
      });
    }
  };

});