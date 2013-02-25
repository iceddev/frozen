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
  './Audio',
  './WebAudio',
  './HTML5Audio',
  'dojo/has',
  '../shims/AudioContext'
], function(Audio, WebAudio, HTML5Audio, has){

  'use strict';

  has.add('WebAudio', function(global){
    return !!global.AudioContext;
  });

  has.add('HTML5Audio', function(global){
    return !!global.Audio;
  });

  return {
    load: function(id, parentRequire, loaded, config){
      if(has('WebAudio')){
        loaded(WebAudio);
      }

      if(has('HTML5Audio')){
        loaded(HTML5Audio);
      }

      loaded(Audio);
    }
  };

});