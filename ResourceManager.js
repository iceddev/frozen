/**
 * The ResourceManager handles loading images and sounds for use in games.
 * @name ResourceManager
 * @constructor ResourceManager
 */

 'use strict';

const has = require('./has');
const Sound = require('./sounds/Sound');
const WebAudio = require('./sounds/WebAudio');
const HTML5Audio = require('./sounds/HTML5Audio');

var resourceList = {};

//TODO: move these to its own module for unit testing?
function normalizePath(baseDir, path){
  var joinedPath = path;
  if(baseDir){
    joinedPath = [baseDir, path].join('/');
  }
  return joinedPath.replace(/\/{2,}/g, '/');
}

function flipX(image){
  var offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.height = image.height;
  offscreenCanvas.width = image.width;
  var ctx = offscreenCanvas.getContext('2d');

  ctx.translate(offscreenCanvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0);
  return offscreenCanvas.toDataURL();
}

function flipY(image){
  var offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.height = image.height;
  offscreenCanvas.width = image.width;
  var ctx = offscreenCanvas.getContext('2d');

  ctx.translate(0, offscreenCanvas.height);
  ctx.scale(1, -1);
  ctx.drawImage(image, 0, 0);
  return offscreenCanvas.toDataURL();
}

class ImageWrapper {
  constructor(filename){
    var self = this;
    self.name = filename;
    self.complete = false;
    self.img = new Image();
    self.img.addEventListener('load', function() {
      self.complete = true;
    }, false);
  }

  load(){
    this.img.src = this.name;
  }
}


class ResourceManager {

  constructor(options = {}){

    /**
     * Whether all the resources have been loaded
     * @type {Boolean}
     * @memberOf ResourceManager#
     * @default
     */
    this.allLoaded = false;

    /**
     * The base directory to load images from
     * @type {String}
     * @memberOf ResourceManager#
     * @default
     */
    this.imageDir = null;

    /**
     * The base directory to load sounds from
     * @type {String}
     * @memberOf ResourceManager#
     * @default
     */
    this.soundDir = null;

    /**
     * A map of all the resources by their URLs
     * @type {Object}
     * @memberOf ResourceManager#
     * @default
     */
    this.resourceList = resourceList;

    Object.assign(this, options);

    // TODO not sure a better way
    if(!this.Sound){
      if(has('WebAudio')){
        this.Sound = WebAudio;
      }
      else if(has('HTML5Audio')){
        this.Sound = HTML5Audio;
      }
      else{
        this.Sound = Sound;
      }
    }
  }

  /**
   * Loads an image (or a collection of images), and tracks if it has finished loading
   * @function
   * @memberOf ResourceManager#
   * @param {String|Array} files Filename of the image relative the Game's HTML page.
   * @returns {Image|Array} Return type based on argument: Image if String or Array of Images if Array
   */
  loadImage(files){
    let singleFile = false;
    if(!Array.isArray(files)) {
      singleFile = true;
      files = [files];
    }

    const fileList = files.map((file) => {
      const filename = normalizePath(this.imageDir, file);
      //if we already have the image, just return it
      if(this.resourceList[filename]){
        return this.resourceList[filename].img;
      }
      this.allLoaded = false;

      const wrapper = new ImageWrapper(filename);
      // Need to explicitly call load because flipImage also uses this object
      // which is probably a bad idea and should change in future
      // TODO: different objects for flipped image and regular image
      wrapper.load();
      this.resourceList[filename] = wrapper;
      return wrapper.img;
    });

    return singleFile ? fileList[0] : fileList;
  }

  /**
   * Loads a sound file (or a collection of sound files), and tracks if it has finished loading
   * @function
   * @memberOf ResourceManager#
   * @param {String|Array} filename Filename of the sound relative the Game's HTML page.
   * @returns {Sound|Array} Return type based on argument: Sound Object if String or Array of Sound Objects if Array
   */
  loadSound(files){
    let singleFile = false;
    if(!Array.isArray(files)) {
      singleFile = true;
      files = [files];
    }

    const fileList = files.map((file) => {
      const filename = normalizePath(this.soundDir, file);
      //if we already have the sound, just return it
      if(this.resourceList[filename]){
        return this.resourceList[filename];
      }
      this.allLoaded = false;

      const sound = new this.Sound(filename);
      this.resourceList[filename] = sound;
      return sound;
    });

    return singleFile ? fileList[0] : fileList;
  }

  /**
   * Flips an image using the logic in a flip function passed and attaches to resource manager with name
   * @function
   * @memberOf ResourceManager#
   * @param  {String|Number} name Name for caching flipped image
   * @param  {Image} image Image to be flipped
   * @param  {Function} flipFn Function containing logic to flip image
   * @return {Image} Flipped image
   */
  flipImage(name, image, flipFn){
    this.allLoaded = false;

    var wrapper = new ImageWrapper(name);
    this.resourceList[name] = wrapper;

    on.once(image, 'load', function(){
      wrapper.img.src = flipFn(image);
    });

    Object.keys(this.resourceList).forEach((key) => {
      const resource = this.resourceList[key];
      if(resource.img === image && resource.complete){
        wrapper.img.src = flipFn(image);
      }
    });

    return wrapper.img;
  }

  /**
   * Flip image along x-axis using default flip logic
   * @function
   * @memberOf ResourceManager#
   * @param  {String|Number} name Name for caching flipped image
   * @param  {Image} image Image to be flipped
   * @return {Image} Flipped image
   */
  flipImageX(name, image){
    return this.flipImage(name, image, flipX);
  }

  /**
   * Flip image along the y-axis using default flip logic
   * @function
   * @memberOf ResourceManager#
   * @param  {String|Number} name Name for caching flipped image
   * @param  {Image} image Image to be flipped
   * @return {Image} Flipped image
   */
  flipImageY(name, image){
    return this.flipImage(name, image, flipY);
  }

  /**
   * Checks whether the resources have finished loading
   * @function
   * @memberOf ResourceManager#
   */
  resourcesReady(){
    if(this.allLoaded){
      return true;
    } else {
      for(var filename in this.resourceList){
        var resource = this.resourceList[filename];
        if(!resource.complete){
          return false;
        }
      }
      this.allLoaded = true;
      return true;
    }
  }

  /**
   * Gets the percent of resources loaded.
   * @function
   * @memberOf ResourceManager#
   * @return {Number} The percent of resources loaded
   */
  getPercentComplete(){
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
    } else {
      return Math.round((numComplete / length) * 100.0);
    }
  }

}

module.exports = ResourceManager;
