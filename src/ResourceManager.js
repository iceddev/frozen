/**

 Copyright 2011 Luis Montes

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**/

 /**
 * The ResourceManager handles DOM events for use in games.
 * @name ResourceManager
 * @class ResourceManager
 */
define([
  'dcl',
  'dcl/bases/Mixer',
  './shims/AudioContext'
], function(dcl, Mixer){

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
      * Loads an image, and tracks if it has finished loading
      * @name ResourceManager#loadImage
      * @function
      * @param {String} filename Filename of the image relative the Game's HTML page.
      *
    */
    loadImage: function(filename){
      filename = normalizePath(this.imageDir, filename);

      //if we already have the image, just return it
      if(this.resourceList[filename]){
        return this.resourceList[filename].img;
      }

      this.allLoaded = false;

      var img = new Image();
      var imgWrapper = {
        name: filename,
        img: img,
        complete: false
      };

      img.onload = function(){
        imgWrapper.complete = true;
      };
      img.src = filename;

      this.resourceList[filename] = imgWrapper;
      return img;
    },

    /**
      * Loads an sound file, and tracks if it has finished loading
      * @name ResourceManager#loadSound
      * @function
      * @param {String} filename Filename of the sound relative the Game's HTML page.
      *
    */
    loadSound: function(filename){
      filename = normalizePath(this.soundDir, filename);

      var soundObj = {
        name: filename,
        buffer: null,
        complete: false
      };

      if(this.audioContext){
        if(this.resourceList[filename]){
          return this.resourceList[filename];
        }

        this.resourceList[filename] = soundObj;

        //if the browser AudioContext, it's new enough for XMLHttpRequest
        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.responseType = 'arraybuffer';

        //TODO fix scope in onload callback
        var audioContext = this.audioContext;
        // Decode asynchronously
        request.onload = function() {
          audioContext.decodeAudioData(request.response,
            function(buffer) {
              soundObj.buffer = buffer;
              soundObj.complete = true;
            },
            function(er){
              console.info('error loading sound',er);
            }
          );
        };
        request.send();

      }

      return soundObj;
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
