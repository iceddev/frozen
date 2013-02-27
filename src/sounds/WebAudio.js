/**
 * An Audio object that implements WebAudio into a generic API
 * @name WebAudio
 * @constructor WebAudio
 * @extends AudioBase
 */

define([
  './AudioBase',
  'dcl',
  'dojo/on',
  'dojo/has',
  'dojo/_base/lang',
  '../shims/AudioContext'
], function(AudioBase, dcl, on, has, lang){

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
      this.name = filename;

      var decodeAudioData = lang.partial(function(self, evt){
        // Decode asynchronously
        self.audioContext.decodeAudioData(this.response,
          function(buffer){
            self.buffer = buffer;
            self.complete = true;
          },
          function(err){
            console.info('error loading sound', err);
          }
        );
      }, this);

      //if the browser AudioContext, it's new enough for XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', filename, true);
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