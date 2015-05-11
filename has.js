'use strict';

// hacky simple implementation of has

const globalAudioContext = require('./shims/AudioContext');


function has(check){

  if(check == 'shittySound'){
    return !!((has('android') || has('ios')) && has('webkit'));
  }
  else if(check == 'android'){
    return (parseFloat(navigator.userAgent.split("Android ")[1]) || undefined);
  }
  else if(check == 'ios'){
    //TODO need something for this
    return false;
  }
  else if(check == 'webkit'){
    return (parseFloat(navigator.userAgent.split("WebKit/")[1]) || undefined);
  }
  else if(check == 'WebAudio'){
    return !!global.AudioContext;
  }
  else if(check === 'HTML5Audio'){
    return !!global.Audio;
  }

  return false;
}

module.exports = has;
