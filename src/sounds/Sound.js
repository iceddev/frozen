/**
 * AMD Plugin to load the correct Sound object
 * @module sounds/Sound
 * @example
 * define([
 *   'frozen/sounds/Sound!'
 * ], function(Sound){
 *
 *   // Use the generic sound object API here - the correct Sound object will be used
 *
 * });
 */

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