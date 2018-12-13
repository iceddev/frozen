/**
 * An Audio object that implements WebAudio into a generic API
 * @name WebAudio
 * @constructor WebAudio
 * @extends Sound
 */

const Sound = require('./Sound');
const removeExtension = require('../utils/removeExtension');
const has = require('../has');

var audioContext = null;


if(has('WebAudio')){
  audioContext = new window.AudioContext();
}

if(has('shittySound')){
  // Similar strategy to https://github.com/CreateJS/SoundJS
  function handleShitty() {
    const source = audioContext.createBufferSource();
    source.buffer = audioContext.createBuffer(1, 1, 22050);
    source.connect(audioContext.destination);
    source.start(0);
    document.removeEventListener('touchstart', handleShitty);
  }
  document.addEventListener('touchstart', handleShitty);
}

class WebAudio extends Sound {
  constructor(options = {}){
    super(options);

    /**
     * The WebAudio AudioContext - used to perform operations on a sound
     * @type {AudioContext}
     * @memberOf WebAudio#
     * @default
     */
    this.audioContext = audioContext;

    /**
     * The sound buffer
     * @type {Buffer}
     * @memberOf WebAudio#
     * @default
     */
    this.buffer = null;

    Object.assign(this, options);
  }

  load(filename){
    var self = this;

    this.name = filename;

    var basename = removeExtension(filename);
    if(basename === filename){
      filename = basename + this._chooseFormat();
    }
    // filename = req.toUrl(filename);

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

    // If the browser has AudioContext, it's new enough for XMLHttpRequest
    var request = new XMLHttpRequest();
    request.open('GET', filename, true);
    request.responseType = 'arraybuffer';

    request.onload = decodeAudioData;
    request.send();
  }

  loop(volume){
    // Return early if we don't have a buffer to protect from unloaded resources
    if(!this.buffer){
      return;
    }

    var audio = this._initAudio(volume, true);
    audio.start(0);
  }

  play(volume, startTime){
    // Return early if we don't have a buffer to protect from unloaded resources
    if(!this.buffer){
      return;
    }

    startTime = startTime || 0;

    var audio = this._initAudio(volume, false);
    audio.start(startTime);
  }

  _initAudio(volume, loop){
    loop = typeof loop === 'boolean' ? loop : false;

    var source = this.audioContext.createBufferSource();
    source.buffer = this.buffer;
    source.loop = loop;
    if(volume){
      var gainNode = this.audioContext.createGain();
      gainNode.gain.value = volume;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
    } else {
      source.connect(this.audioContext.destination);
    }
    return source;
  }
}

module.exports = WebAudio;
