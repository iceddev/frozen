define([
  'dcl',
  'dojo/on',
  'dojo/_base/lang'
], function(dcl, on, lang){

  'use strict';

  return dcl(null, {
    declaredClass: 'frozen/sounds/HTML5Audio',
    name: null,
    complete: false,
    audio: null,
    constructor: function(filename){
      this.audio = new Audio();
      if(typeof filename === 'string'){
        this.load(filename);
      }
    },
    load: function(filename){
      this.name = filename;
      this.audio.pause();
      this.audio.preload = 'auto';
      this.audio.src = filename;
      on(this.audio, 'loadeddata', lang.hitch(this, function(e){
        this.complete = true;
      }));
    },
    loop: function(volume){
      var audio = this._initAudio(volume, true);
      on(audio, 'loadeddata', function(e){
        audio.play();
      });
    },
    play: function(volume, startTime){
      startTime = startTime || 0;

      var audio = this._initAudio(volume, false);
      on(audio, 'loadeddata', function(e){
        audio.currentTime = startTime / 1000;
        audio.play();
      });
    },
    _initAudio: function(volume, loop){
      loop = typeof loop === 'boolean' ? loop : false;

      var audio = new Audio();
      audio.pause();
      audio.volume = volume || 1;
      audio.loop = loop;
      audio.preload = 'auto';
      audio.src = this.name;
      return audio;
    }
  });

});