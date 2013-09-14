define([
  'frozen/GameCore',
  'frozen/ResourceManager',
  'frozen/InputManager'
], function(GameCore, ResourceManager, InputManager){

  'use strict';

  describe('GameCore', function(){

    var game;
    var canvas;

    beforeEach(function(){
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      game = new GameCore({
        canvas: canvas,
        beforeUpdate: jasmine.createSpy('beforeUpdate')
      });
    });

    afterEach(function(){
      game.stop();
      document.body.removeChild(canvas);
    });

    it('should default to FONT_SIZE of 24', function(){
      expect(game.statics.FONT_SIZE).toBe(24);
    });

    it('should not be running', function(){
      expect(game.isRunning).toBe(false);
    });

    it('should not have a canvasId by default', function(){
      expect(game.canvasId).toBeNull();
    });

    it('should default to maxStep of 40', function(){
      expect(game.maxStep).toBe(40);
    });

    it('should default to contextType of 2d', function(){
      expect(game.contextType).toBe('2d');
    });

    it('should default to height of 0', function(){
      expect(game.height).toBe(0);
    });

    it('should default to width of 0', function(){
      expect(game.width).toBe(0);
    });

    it('should not have a resourceManager by default', function(){
      expect(game.resourceManager).toBeNull();
    });

    it('should not have an inputManager by default', function(){
      expect(game.inputManager).toBeNull();
    });

    it('shoulf default to loadingForeground of #00F', function(){
      expect(game.loadingForeground).toBe('#00F');
    });

    it('should default to loadingBackground to #FFF', function(){
      expect(game.loadingBackground).toBe('#FFF');
    });

    it('should not have a gameAreaId by default', function(){
      expect(game.gameAreaId).toBeNull();
    });

    it('should default to canvasPercentage of 0', function(){
      expect(game.canvasPercentage).toBe(0);
    });

    // TODO: should these be split out into their own tests?
    it('should have functions defined', function(){
      expect(game.setHeight).toBeDefined();
      expect(game.setWidth).toBeDefined();
      expect(game.stop).toBeDefined();
      expect(game.run).toBeDefined();
      expect(game.loadResources).toBeDefined();
      expect(game.init).toBeDefined();
      expect(game.initInput).toBeDefined();
      expect(game.handleInput).toBeDefined();
      expect(game.gameLoop).toBeDefined();
      expect(game.launchLoop).toBeDefined();
      expect(game.loopRunner).toBeDefined();
      expect(game.update).toBeDefined();
      expect(game.updateLoadingScreen).toBeDefined();
      expect(game.draw).toBeDefined();
      expect(game.drawLoadingScreen).toBeDefined();
    });

    describe('GameCore.setHeight()', function(){

      it('should set the height of game and game.canvas when setHeight is called after init', function(){
        expect(game.height).toBe(0);
        expect(game.canvas.height).toBe(150);

        game.init();

        expect(game.height).toBe(150);
        expect(game.canvas.height).toBe(150);

        game.setHeight(300);

        expect(game.height).toBe(300);
        expect(game.canvas.height).toBe(300);
      });

    });

    describe('GameCore.setWidth()', function(){

      it('should set the width of game and game.canvas when setWidth is called after init', function(){
        expect(game.width).toBe(0);
        expect(game.canvas.width).toBe(300);

        game.init();

        expect(game.width).toBe(300);
        expect(game.canvas.width).toBe(300);

        game.setWidth(150);

        expect(game.width).toBe(150);
        expect(game.canvas.width).toBe(150);
      });

    });

    describe('GameCore.stop()', function(){

      it('should not be running after stop is called', function(){
        expect(game.isRunning).toBe(false);

        game.run();

        expect(game.isRunning).toBe(true);
        expect(game.requestId).not.toBe(null);

        game.stop();

        spyOn(game, 'gameLoop');

        expect(game.isRunning).toBe(false);
        expect(game.requestId).toBe(null);
        expect(game.gameLoop).not.toHaveBeenCalled();
      });

    });

    describe('GameCore.run()', function(){

      beforeEach(function() {
        spyOn(game, 'init').andCallThrough();
        spyOn(game, 'loadResources').andCallThrough();
        spyOn(game, 'initInput').andCallThrough();
        spyOn(game, 'launchLoop').andCallThrough();

        game.run();
      });

      it('should call init when run is called', function(){
        expect(game.init).toHaveBeenCalled();
      });

      it('should call loadResources with the resourceManager when run is called', function(){
        expect(game.loadResources).toHaveBeenCalledWith(game.resourceManager);
        expect(game.loadResources.calls.length).toEqual(1);
      });

      it('should call initInput with the inputManager when run is called', function(){
        expect(game.initInput).toHaveBeenCalledWith(game.inputManager);
      });

      it('should call launchLoop when run is called', function(){
        expect(game.launchLoop).toHaveBeenCalled();
        expect(game.requestId).not.toBe(null);
      });

      it('should be running after run is called', function(){
        expect(game.isRunning).toBe(true);
      });

    });

    describe('GameCore.loadResources()', function(){

      beforeEach(function(){
        spyOn(game, 'loadResources');
      });

      it('should be called by game.run with the resourceManager', function(){
        game.run();

        expect(game.loadResources).toHaveBeenCalled();
        expect(game.loadResources.calls.length).toEqual(1);
        expect(game.loadResources).toHaveBeenCalledWith(game.resourceManager);
      });

      it('should be called by game.init with the resourceManager', function(){
        game.init();

        expect(game.loadResources).toHaveBeenCalled();
        expect(game.loadResources.calls.length).toEqual(1);
        expect(game.loadResources).toHaveBeenCalledWith(game.resourceManager);
      });

    });

    describe('GameCore.init()', function(){

      it('should retrieve a canvas element by ID if canvas isn\'t specified', function(){
        game.canvas = null;
        game.canvasId = 'testCanvas';

        // Canvas in the DOM
        var canvas = document.createElement('canvas');
        canvas.id = 'testCanvas';
        document.body.appendChild(canvas);

        expect(game.canvas).toBeNull();

        game.init();

        expect(game.canvas).toBe(canvas);

        // Cleanup
        document.body.removeChild(canvas);
      });

      it('should show alert message if canvas is not available', function(){
        game.canvas = null;
        game.canvasId = 'testCanvas';

        spyOn(window, 'alert');

        expect(game.canvas).toBeNull();

        game.init();

        expect(window.alert).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Sorry, your browser does not support canvas.  I recommend any browser but Internet Explorer');
        expect(window.alert.calls.length).toEqual(1);
      });

      it('should show alert message if context is not available', function(){
        game.contextType = 'unknown';

        spyOn(window, 'alert');

        expect(game.context).toBeUndefined();

        game.init();

        expect(window.alert).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Sorry, your browser does not support a unknown drawing surface on canvas.  I recommend any browser but Internet Explorer');
        expect(window.alert.calls.length).toEqual(1);
      });

      it('should retrieve a context from the canvas if one isn\'t specified', function(){
        game.context = null;

        var context = game.canvas.getContext(game.contextType);

        expect(game.context).toBeNull();

        game.init();

        expect(game.context).toBe(context);
      });

      it('should have a height of 150 and width of 300 (when neither were specified) after init is called', function(){
        expect(game.height).toBe(0);
        expect(game.width).toBe(0);

        game.init();

        expect(game.height).toBe(150);
        expect(game.width).toBe(300);
      });

      it('should contain a new instance of InputManger as inputManager property after init is called', function(){
        expect(game.inputManager instanceof InputManager).toBe(false);

        game.init();

        expect(game.inputManager instanceof InputManager).toBe(true);
      });

      it('should instantiate an InputManager with gameArea and canvasPercentage if configured on game', function(){
        // Canvas in the DOM
        var gameArea = document.createElement('div');
        gameArea.id = 'gameArea';
        document.body.appendChild(gameArea);

        game.gameAreaId = 'gameArea';
        game.canvasPercentage = 0.95;

        expect(game.inputManager).toBeNull();

        game.init();

        expect(game.inputManager.gameArea).toBe(gameArea);
        expect(game.inputManager.canvasPercentage).toBe(0.95);

        document.body.removeChild(gameArea);
      });

      it('should not instantiate a new InputManager if one is supplied before init', function(){
        var im = new InputManager({
          canvas: game.canvas
        });

        var im2 = new InputManager({
          canvas: game.canvas
        });

        game.inputManager = im;

        expect(game.inputManager).toBe(im);
        expect(game.inputManager).not.toBe(im2);

        game.init();

        expect(game.inputManager).toBe(im);
        expect(game.inputManager).not.toBe(im2);
      });

      it('should call inputManager.resize during init', function(){
        game.inputManager = new InputManager({
          canvas: game.canvas
        });

        spyOn(game.inputManager, 'resize');

        game.init();

        expect(game.inputManager.resize).toHaveBeenCalled();
      });

      it('should contain a new instance of ResourceManager as resourceManager property after init is called', function(){
        expect(game.resourceManager instanceof ResourceManager).toBe(false);

        game.init();

        expect(game.resourceManager instanceof ResourceManager).toBe(true);
      });

      it('should not instantiate a new ResourceManager if one is supplied before init', function(){
        var rm  = new ResourceManager();
        var rm2 = new ResourceManager();

        game.resourceManager = rm;

        expect(game.resourceManager).toBe(rm);
        expect(game.resourceManager).not.toBe(rm2);

        game.init();

        expect(game.resourceManager).toBe(rm);
        expect(game.resourceManager).not.toBe(rm2);
      });

    });

    describe('GameCore.initInput()', function(){

      beforeEach(function() {
        spyOn(game, 'initInput');
      });

      it('should be called when run is called', function(){
        game.run();

        expect(game.initInput).toHaveBeenCalled();
        expect(game.initInput).toHaveBeenCalledWith(game.inputManager);
      });

    });

    describe('GameCore.handleInput()', function(){
      var flag = false;

      beforeEach(function(){
        spyOn(game, 'handleInput').andCallFake(function(){
          flag = true;
        });
      });

      afterEach(function(){
        flag = false;
      });

      it('should be called while game is running', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return flag;
        }, 'handleInput should have been called', 500);

        runs(function(){
          expect(game.handleInput).toHaveBeenCalled();
          expect(game.handleInput).toHaveBeenCalledWith(game.inputManager, game.elapsedTime);
        });
      });

    });

    describe('GameCore.gameLoop()', function(){
      var flag = false;

      beforeEach(function(){
        spyOn(game, 'gameLoop').andCallFake(function(){
          flag = true;
        });
      });

      afterEach(function(){
        flag = false;
      });

      it('should be called while game is running', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function () {
          return flag;
        }, 'gameLoop should have been called', 500);

        runs(function(){
          expect(game.gameLoop).toHaveBeenCalled();
        });
      });

    });

    describe('GameCore.beforeUpdate()', function(){

      it('should be called while the game is running', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return game.beforeUpdate.callCount;
        }, 'beforeUpdate should have been called', 500);

        runs(function(){
          expect(game.beforeUpdate).toHaveBeenCalled();
          expect(game.beforeUpdate).toHaveBeenCalledWith(game.elapsedTime);
        });
      });

      it('should not be called while game is paused', function(){
        var flag = false;

        runs(function(){
          game.paused = true;
          game.run();
          setTimeout(function(){
            flag = true;
          }, 250); // TODO: might need to adjust this timeout if test errors
        });

        waitsFor(function(){
          return flag || game.beforeUpdate.callCount;
        }, 'beforeUpdate should not have been called', 500);

        runs(function(){
          expect(game.beforeUpdate).not.toHaveBeenCalled();
        });
      });

    });

    describe('GameCore.update()', function(){
      var flag = false;

      beforeEach(function(){
        spyOn(game, 'update').andCallFake(function(){
          flag = true;
        });
      });

      afterEach(function(){
        flag = false;
      });

      it('should be called while the game is running', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return flag;
        }, 'update should have been called', 500);

        runs(function(){
          expect(game.update).toHaveBeenCalled();
          expect(game.update).toHaveBeenCalledWith(game.elapsedTime);
        });
      });

      it('should not be called while game is paused', function(){
        runs(function(){
          game.paused = true;
          game.run();
          setTimeout(function(){
            flag = true;
          }, 499); // TODO: might need to adjust this timeout if test errors
        });

        waitsFor(function(){
          return flag;
        }, 'update should not have been called', 500);

        runs(function(){
          expect(game.update).not.toHaveBeenCalled();
        });
      });

    });

    describe('GameCore.updateLoadingScreen()', function(){
      var flag = false;
      var rm;

      beforeEach(function(){
        spyOn(game, 'updateLoadingScreen').andCallFake(function(){
          flag = true;
        });

        rm = new ResourceManager();
        rm.resourceList.mock = {
          complete: false
        };
        game.resourceManager = rm;
      });

      afterEach(function(){
        flag = false;
        rm = null;
      });

      it('should be called while the game is running and resources are not complete', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return flag;
        }, 'updateLoadingScreen should have been called', 500);

        runs(function(){
          expect(game.updateLoadingScreen).toHaveBeenCalled();
          expect(game.updateLoadingScreen).toHaveBeenCalledWith(game.elapsedTime);
        });
      });

      it('should not be called while the game is running and all resources are complete', function(){
        runs(function(){
          rm.resourceList.mock.complete = true;
          game.run();
          setTimeout(function(){
            flag = true;
          }, 499); // TODO: might need to adjust this timeout if test errors
        });

        waitsFor(function(){
          return flag;
        }, 'updateLoadingScreen should not have been called', 500);

        runs(function(){
          expect(game.updateLoadingScreen).not.toHaveBeenCalled();
        });
      });

    });

    describe('GameCore.draw()', function(){
      var flag = false;

      beforeEach(function(){
        spyOn(game, 'draw').andCallFake(function(){
          flag = true;
        });
      });

      afterEach(function(){
        flag = false;
      });

      it('should be called while the game is running', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return flag;
        }, 'draw should have been called', 500);

        runs(function(){
          expect(game.draw).toHaveBeenCalled();
          expect(game.draw).toHaveBeenCalledWith(game.context);
        });
      });

      it('should be called while the game is paused', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return flag;
        }, 'draw should have been called', 500);

        runs(function(){
          expect(game.draw).toHaveBeenCalled();
          expect(game.draw).toHaveBeenCalledWith(game.context);
        });
      });

    });

    describe('GameCore.drawLoadingScreen()', function(){
      var flag = false;
      var rm;

      beforeEach(function(){
        spyOn(game, 'drawLoadingScreen').andCallFake(function(){
          flag = true;
        });

        rm = new ResourceManager();
        rm.resourceList.mock = {
          complete: false
        };
        game.resourceManager = rm;
      });

      afterEach(function(){
        flag = false;
        rm = null;
      });

      it('should be called while the game is running and resources are not complete', function(){
        runs(function(){
          game.run();
        });

        waitsFor(function(){
          return flag;
        }, 'drawLoadingScreen should have been called', 500);

        runs(function(){
          expect(game.drawLoadingScreen).toHaveBeenCalled();
          expect(game.drawLoadingScreen).toHaveBeenCalledWith(game.context);
        });
      });

      it('should not be called while the game is running and all resources are complete', function(){
        runs(function(){
          rm.resourceList.mock.complete = true;
          game.run();
          setTimeout(function(){
            flag = true;
          }, 499); // TODO: might need to adjust this timeout if test errors
        });

        waitsFor(function(){
          return flag;
        }, 'drawLoadingScreen should not have been called', 500);

        runs(function(){
          expect(game.drawLoadingScreen).not.toHaveBeenCalled();
        });
      });

    });
  });

});
