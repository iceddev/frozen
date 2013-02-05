/**
 * The ResourceManager handles DOM events for use in games.
 * @name ResourceManager
 * @class ResourceManager
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  'dojo/on',
  './shims/AudioContext'
], function(dcl, Mixer, lang, on){

  'use strict';

  function normalizePath(baseDir, path){
    var joinedPath = path;
    if(baseDir){
      joinedPath = [baseDir, path].join('/');
    }
    return joinedPath.replace(/\/{2,}/g, '/');
  }

  var audioContext = null;
  if(window.AudioContext){
    audioContext = new window.AudioContext();
  }else{
    console.log('WebAudio not supported');
  }

  return dcl(Mixer, {
    imageCount: 0,
    loadedImages: 0,
    allLoaded: false,
    imageDir: null,
    soundDir: null,
    audioContext: audioContext,
    resourceList: {},

    /**
      * Loads an image (or a collection of images), and tracks if it has finished loading
      * @name ResourceManager#loadImage
      * @function
      * @param {String|Array|Object} files Filename of the image relative the Game's HTML page.
      * @returns {Image|Array|Object} Return type based on argument: Image if String, Array of Images if Array, or Object of key-Image pairs if Object
      *
    */
    loadImage: function(files){
      var singleFile = false;
      // Normalize arguments
      if(!Array.isArray(files)){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else if(typeof files !== 'object'){
          return;
        }
      }

      for(var key in files){
        if(!files.hasOwnProperty(key)){
          continue;
        }
        var filename = normalizePath(this.imageDir, files[key]);

        //if we already have the image, just return it
        if(this.resourceList[filename]){
          files[key] = this.resourceList[filename].img;
          continue;
        }

        this.allLoaded = false;

        var img = new Image();
        var imgWrapper = {
          name: filename,
          img: img,
          complete: false
        };

        var imageComplete = lang.partial(function(imgWrapper, evt){
          imgWrapper.complete = true;
        }, imgWrapper);
        on(img, 'load', imageComplete);
        img.src = filename;

        this.resourceList[filename] = imgWrapper;
        files[key] = img;
      }

      return singleFile ? files[0] : files;
    },

    /**
      * Loads a sound file (or a collection of sound files), and tracks if it has finished loading
      * @name ResourceManager#loadSound
      * @function
      * @param {String|Array|Object} filename Filename of the sound relative the Game's HTML page.
      * @returns {Sound Object|Array|Object} Return type based on argument: Sound Object if String, Array of Sound Objects if Array, or Object of key-Sound Object pairs if Object
      *
    */
    loadSound: function(files){
      var singleFile = false;
      // Normalize arguments
      if(!Array.isArray(files)){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else if(typeof files !== 'object'){
          return;
        }
      }

      for(var key in files){
        if(!files.hasOwnProperty(key)){
          continue;
        }
        var filename = normalizePath(this.soundDir, files[key]);

        var soundObj = {
          name: filename,
          buffer: null,
          complete: false
        };

        if(this.audioContext){

          //if we already have the image, just return it
          if(this.resourceList[filename]){
            files[key] = this.resourceList[filename];
            continue;
          }

          this.allLoaded = false;

          this.resourceList[filename] = soundObj;

          var decodeAudioData = lang.partial(function(soundObj, audioContext, evt){
            // Decode asynchronously
            audioContext.decodeAudioData(this.response,
              function(buffer){
                soundObj.buffer = buffer;
                soundObj.complete = true;
              },
              function(er){
                console.info('error loading sound',er);
              }
            );
          }, soundObj, this.audioContext);

          //if the browser AudioContext, it's new enough for XMLHttpRequest
          var request = new XMLHttpRequest();
          request.open('GET', filename, true);
          request.responseType = 'arraybuffer';

          on(request, 'load', decodeAudioData);
          request.send();
        }
        files[key] = soundObj;
      }
      return singleFile ? files[0] : files;
    },

    /**
      * Plays a sound that was loaded from loadSound()
      * @name ResourceManager#playSound
      * @function
      * @param {Object} sound A sound object that was returned from loadSound()
      * @param {Boolean=} loop whether or not to loop the sound (default: false)
      * @param {Number=} noteOn The number of milliseconds from the beginning of the sound file to start (default: zero)
      * @param {Number=} gain The volume of the playback from 0 to 1.0
      *
    */
    playSound: function(sound, loop, noteOn, gain){
      noteOn = noteOn || 0;
      if(this.audioContext && sound){
        var buffer = sound.buffer || sound;
        if(buffer){
          try{
            var source = this.audioContext.createBufferSource(); // creates a sound source
            source.buffer = buffer;                  // tell the source which sound to play
            if(loop){
              source.loop = true;
            }
            if(gain){
              var gainNode = this.audioContext.createGainNode();
              gainNode.gain.value = gain;
              source.connect(gainNode);
              gainNode.connect(this.audioContext.destination);
            }else{
              source.connect(this.audioContext.destination);       // connect the source to the context's destination (the speakers)
            }
            source.noteOn(noteOn);                       // play the source now
            return source;
          }catch(se){
            console.info('error playing sound',se);
          }
        }
      }
    },

    /**
      * Checks whether the resources have finished loading
      * @name ResourceManager#resourcesReady
      * @function
    */
    resourcesReady: function(){
      if(this.allLoaded){
        return true;
      }else{
        for(var filename in this.resourceList){
          var resource = this.resourceList[filename];
          if(!resource.complete){
            return false;
          }
        }
        this.allLoaded = true;
        return true;
      }
    },

    /**
      * Gets the percentage of resources loaded.
      * @name ResourceManager#getPercentComplete
      * @function
    */
    getPercentComplete: function(){
      var numComplete = 0.0;
      var length = 0;
      for(var filename in this.resourceList){
        var resource = this.resourceList[filename];
        length++;
        if(resource.complete){
          numComplete = numComplete + 1.0;
        }
      }
      if(length === 0){
        return 0;
      }else{
        return Math.round((numComplete / length) * 100.0);
      }
    }
  });

});
