/**
 * AMD Plugin to load the correct Sound object
 * @module plugins/sound
 * @example
 * define([
 *   'frozen/plugins/sound!'
 * ], function(Sound){
 *
 *   // Use the generic sound object API here - the correct Sound object will be used
 *
 * });
 */

define([
  '../sounds/Sound',
  '../sounds/WebAudio',
  '../sounds/HTML5Audio',
  '../support'
], function(Sound, WebAudio, HTML5Audio, support){

  'use strict';

  return {
    load: function(id, parentRequire, loaded, config){
      if(support['web-audio']){
        return loaded(WebAudio);
      }

      if(support['html5-audio']){
        return loaded(HTML5Audio);
      }

      return loaded(Sound);
    }
  };

});
