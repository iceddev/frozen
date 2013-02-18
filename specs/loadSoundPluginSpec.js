// TODO: these tests don't pass in phantom and cause async race conditions with ResourceManagerSpec

/*define([
  'frozen/plugins/loadSound!specs/fixtures/yipee.wav',
  'frozen/plugins/loadSound![specs/fixtures/yipee.wav,specs/fixtures/yipee.wav,specs/fixtures/yipee.wav]',
  'frozen/plugins/loadSound!{sound1:specs/fixtures/yipee.wav,sound2:specs/fixtures/yipee.wav,sound3:specs/fixtures/yipee.wav}',
  'frozen/sounds/WebAudio',
  'frozen/sounds/HTML5Audio'
], function(singleSound, soundArray, soundObject, WebAudio, HTML5Audio){

  'use strict';

  xdescribe('plugins/loadSound', function(){

    it('should load a single sound', function(){
      expect(singleSound instanceof WebAudio || singleSound instanceof HTML5Audio).toBe(true);
    });

    it('should load an array of sounds', function(){
      expect(Array.isArray(soundArray)).toBe(true);
      expect(soundArray.length).toBe(3);
      soundArray.forEach(function(sound){
        expect(sound instanceof WebAudio || sound instanceof HTML5Audio).toBe(true);
      });
    });

    it('should load an object of sounds', function(){
      expect(Array.isArray(soundObject)).toBe(false);
      expect(typeof soundObject).toBe('object');
      Object.keys(soundObject).forEach(function(key){
        expect(['sound1', 'sound2', 'sound3']).toContain(key);
      });
    });

  });

});*/