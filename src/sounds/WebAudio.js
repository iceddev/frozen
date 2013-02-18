/**
 * A Sound object that abstracts WebAudio into a generic API that can also be used with HTML5 Audio
 * @name WebAudio
 * @constructor WebAudio
 */

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
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf WebAudio#
     * @default
     */
    declaredClass: 'frozen/sounds/WebAudio',
    /**
     * The name of the Sound object - typically the filename
     * @type {String}
     * @memberOf WebAudio#
     * @default
     */
    name: null,
    /**
     * Signals if the Sound object has completed loading
     * @type {Boolean}
     * @memberOf WebAudio#
     * @default
     */
    complete: false,
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

    constructor: function(filename){
      if(typeof filename === 'string'){
        this.load(filename);
      }
    },

    /**
     * Load the sound by filename
     * @function
     * @memberOf WebAudio#
     * @param  {String} filename The filename of the file to load
     */
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

    /**
     * Loop the sound at a certain volume
     * @function
     * @memberOf WebAudio#
     * @param  {Number} volume Value of volume - between 0 and 1
     */
    loop: function(volume){
      var audio = this._initAudio(volume, true);
      audio.noteOn(0);
    },

    /**
     * Play the sound at a certain volume and start time
     * @function
     * @memberOf WebAudio#
     * @param  {Number} volume    Value of volume - between 0 and 1
     * @param  {Number} startTime Value of milliseconds into the track to start
     */
    play: function(volume, startTime){
      startTime = startTime || 0;

      var audio = this._initAudio(volume, false);
      audio.noteOn(startTime);
    },

    /**
     * Method used to construct Audio objects internally
     * @function
     * @memberOf WebAudio#
     * @private
     * @param  {Number} volume Value of volume - between 0 and 1
     * @param  {Boolean} loop Whether or not to loop audio
     * @return {Audio} Audio object that was constructed
     */
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