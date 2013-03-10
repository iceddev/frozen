/**
 * An Audio object that implements WebAudio into a generic API
 * @name WebAudio
 * @constructor WebAudio
 * @extends AudioBase
 */

define([
  './AudioBase',
  '../utils/removeExtension',
  'dcl',
  'dojo/on',
  'dojo/has',
  '../shims/AudioContext'
], function(AudioBase, removeExtension, dcl, on, has){

  'use strict';

  has.add('WebAudio', function(global){
    return !!global.AudioContext;
  });

  var audioContext = null;
  if(has('WebAudio')){
    audioContext = new window.AudioContext();
  }

  return dcl(AudioBase, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf WebAudio#
     * @default
     */
    declaredClass: 'frozen/sounds/WebAudio',
    /**
     * The WebAudio AudioContext - used to perform operations on a sound
     * @type {AudioContext}
     * @memberOf WebAudio#
     * @default
     */
    audioContext: audioContext,
    /**
     * The sound buffer
     * @type {Buffer}
     * @memberOf WebAudio#
     * @default
     */
    buffer: null,

    load: function(filename){
      this.name = removeExtension(filename) + this._chooseFormat();

      var self = this;

      function decodeAudioData(e){
        // Decode asynchronously
        self.audioContext.decodeAudioData(e.target.response,
          function(buffer){
            self.buffer = buffer;
            self.complete = true;
          },
          function(err){
            var format = self._nextFormat();
            if(format){
              self.load(self.name);
            } else {
              self.complete = true;
            }
          }
        );
      }

      //if the browser AudioContext, it's new enough for XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', this.name, true);
      request.responseType = 'arraybuffer';

      on(request, 'load', decodeAudioData);
      request.send();
    },

    loop: function(volume){
      var audio = this._initAudio(volume, true);
      audio.noteOn(0);
    },

    play: function(volume, startTime){
      startTime = startTime || 0;

      var audio = this._initAudio(volume, false);
      audio.noteOn(startTime);
    },

    _initAudio: function(volume, loop){
      loop = typeof loop === 'boolean' ? loop : false;

      var source = this.audioContext.createBufferSource();
      source.buffer = this.buffer;
      source.loop = loop;
      if(volume){
        var gainNode = this.audioContext.createGainNode();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
      } else {
        source.connect(this.audioContext.destination);
      }
      return source;
    }
  });

});