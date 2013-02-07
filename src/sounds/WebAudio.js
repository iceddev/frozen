define([
  'dcl',
  'dojo/on',
  'dojo/_base/lang'
], function(dcl, on, lang){

  'use strict';

  var audioContext = null;
  if(window.AudioContext){
    audioContext = new window.AudioContext();
  } else {
    console.log('WebAudio not supported');
  }

  return dcl(null, {
    declaredClass: 'frozen/sounds/WebAudio',
    name: null,
    complete: false,
    audioContext: audioContext,
    buffer: null,
    constructor: function(filename){
      if(typeof filename === 'string'){
        this.load(filename);
      }
    },
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