/**
 * The ResourceManager handles DOM events for use in games.
 * @name ResourceManager
 * @class ResourceManager
 */

define([
  './sounds/Sound!',
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  'dojo/on'
], function(Sound, dcl, Mixer, lang, on){

  'use strict';

  function normalizePath(baseDir, path){
    var joinedPath = path;
    if(baseDir){
      joinedPath = [baseDir, path].join('/');
    }
    return joinedPath.replace(/\/{2,}/g, '/');
  }

  return dcl(Mixer, {
    imageCount: 0,
    loadedImages: 0,
    allLoaded: false,
    imageDir: null,
    soundDir: null,
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

        //if we already have the sound, just return it
        if(this.resourceList[filename]){
          files[key] = this.resourceList[filename];
          continue;
        }

        this.allLoaded = false;

        var sound = new Sound(filename);
        this.resourceList[filename] = sound;

        files[key] = sound;
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
      if(sound){
        if(loop){
          sound.loop(gain);
        } else {
          noteOn = noteOn || 0;
          sound.play(gain, noteOn);
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
