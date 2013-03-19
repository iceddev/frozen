define([
  'frozen/sounds/HTML5Audio',
  'frozen/sounds/Sound',
  'dcl',
  'dojo/has'
], function(HTML5Audio, Sound, dcl, has){

  'use strict';

  describe('HTML5Audio', function(){

    it('should add a has test for HTML5Audio', function(){
      expect(has('HTML5Audio')).toBeDefined();
    });

    it('should add a has test for shittySound (mobile)', function(){
      expect(has('shittySound')).toBeDefined();
    });

  });

  if(has('HTML5Audio') && !has('shittySound')){
    describe('HTML5Audio', function(){
      var sound;
      var filename = has('ie') ? 'specs/fixtures/yipee.mp3' : 'specs/fixtures/yipee.wav';
      var filename2 = 'specs/fixtures/yipee';

      beforeEach(function(){
        sound = new HTML5Audio();
      });

      it('should inherit from Sound', function(){
        expect(dcl.isInstanceOf(sound, Sound)).toBe(true);
      });

      it('should default to an audio of null', function(){
        expect(sound.audio).toBeNull();
      });

      describe('HTML5Audio.load()', function(){

        it('should create a new instance of Audio as audio', function(){
          var audio = new Audio();
          sound.load(filename);
          expect(sound.audio).toBeDefined();
          expect(sound.audio instanceof Audio).toBe(true);
          expect(sound.audio).not.toBe(audio);
        });

        it('should set the name to the filename passed in', function(){
          sound.load(filename);
          expect(sound.name).toBe(filename);
        });

        it('should add an extension if one is not specified on filename passed in', function(){
          spyOn(sound, '_chooseFormat').andCallThrough();

          sound.load(filename2);
          expect(sound._chooseFormat).toHaveBeenCalled();
        });

        it('should try another extension if one is not specified on filename passed in and the first one fails', function(){
          var flag = false;
          spyOn(sound, '_chooseFormat').andReturn('');
          spyOn(sound, '_nextFormat').andCallFake(function(){
            flag = true;
          });

          runs(function(){
            sound.load(filename2);
          });

          waitsFor(function(){
            return flag;
          }, '_nextFormat should have been called', 1000);

          runs(function(){
            expect(sound._nextFormat).toHaveBeenCalled();
          });
        });

        it('should set complete to true if all extensions fail', function(){
          spyOn(sound, '_chooseFormat').andCallThrough();
          spyOn(sound, '_nextFormat').andCallThrough();

          sound.formats = {};
          sound.probably.length = 0;
          sound.maybe.length = 0;

          runs(function(){
            sound.load(filename2);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 1000);

          runs(function(){
            expect(sound.complete).toBe(true);
          });
        });

        it('should set the audio.src to the filename passed in', function(){
          var origin = window.location.toString().replace(window.location.pathname, '');
          sound.load(filename);
          expect(sound.audio.src).toBe(origin + '/' + filename);
        });

        it('should mark the sound as complete when done loading data', function(){
          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 1000);

          runs(function(){
            expect(sound.complete).toBe(true);
          });
        });

      });

      describe('HTML5Audio.loop()', function(){
        var audio;

        beforeEach(function(){
          audio = new Audio();
          spyOn(audio, 'play');

          spyOn(sound, '_initAudio').andCallFake(function(){
            audio.volume = 0;
            audio.src = filename;
            return audio;
          });

          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 1000);
        });

        it('should initialize a new audio', function(){
          runs(function(){
            sound.loop();
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(undefined, true);
          });
        });

        it('should initialize the new audio with the volume passed in', function(){
          runs(function(){
            sound.loop(1);
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(1, true);
          });
        });

        it('should call play on the new audio', function(){
          runs(function(){
            sound.loop();
          });

          waitsFor(function(){
            return audio.play.callCount;
          }, 'play should have been called', 1000);

          runs(function(){
            expect(audio.play).toHaveBeenCalled();
          });
        });

      });

      describe('HTML5Audio.play()', function(){
        var audio;

        beforeEach(function(){
          audio = new Audio();
          spyOn(audio, 'play');

          spyOn(sound, '_initAudio').andCallFake(function(){
            audio.volume = 0;
            audio.src = filename;
            return audio;
          });

          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 1000);
        });

        it('should initialize a new audio', function(){
          runs(function(){
            sound.play();
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(undefined, false);
          });
        });

        it('should initialize the new audio with the volume passed in', function(){
          runs(function(){
            sound.play(1);
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(1, false);
          });
        });

        it('should call play on the new audio', function(){
          runs(function(){
            sound.play();
          });

          waitsFor(function(){
            return audio.play.callCount;
          }, 'play should have been called', 1000);

          runs(function(){
            expect(audio.play).toHaveBeenCalled();
          });
        });

        it('should set the currentTime on the new audio to 0 if no startTime is passed in', function(){
          runs(function(){
            sound.play();
          });

          waitsFor(function(){
            return audio.play.callCount;
          }, 'play should have been called', 1000);

          runs(function(){
            expect(audio.currentTime).toBe(0);
          });
        });

        it('should set the currentTime on the new audio to startTime (converted from ms to seconds) passed in', function(){
          runs(function(){
            sound.play(1, 200);
          });

          waitsFor(function(){
            return audio.play.callCount;
          }, 'play should have been called', 1000);

          runs(function(){
            // Floating-point...
            var currentTime = Math.floor(audio.currentTime * 10) / 10;
            expect(currentTime).toBe(0.2);
          });
        });

      });

     describe('HTML5Audio._initAudio()', function(){

        beforeEach(function(){
          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 1000);
        });

        it('should return a new Audio', function(){
          runs(function(){
            var audio = new Audio();
            var init = sound._initAudio();
            expect(init).toBeDefined();
            expect(init instanceof Audio).toBe(true);
            expect(init).not.toBe(audio);
          });
        });

        it('should set audio.loop to the value of loop passed in, defaulting to false', function(){
          runs(function(){
            expect(sound._initAudio().loop).toBe(false);
            expect(sound._initAudio(null, true).loop).toBe(true);
            expect(sound._initAudio(null, false).loop).toBe(false);
          });
        });

        it('should set the volume to the volume passed in, defaulting to 1', function(){
          runs(function(){
            expect(sound._initAudio().volume).toBe(1);
            expect(sound._initAudio(0.5).volume).toBe(0.5);
          });
        });

        it('should set the new audio.src to the cached audio.currentSrc, if mozLoadFrom is not available', function(){
          runs(function(){
            if(!(new Audio().mozLoadFrom)){
              expect(sound._initAudio().src).toBe(sound.audio.currentSrc);
            }
          });
        });

        // TODO: figure out how to test mozLoadFrom
      });

    });
  }

  if(has('shittySound')){
    // TODO: figure out a way to run tests that require input on mobile devices
  }

});