'use strict';

const GameCore = require('../GameCore');
const InputManager = require('../InputManager');
const ResourceManager = require('../ResourceManager');
const expect = require('expect');


describe('GameCore', function(){

  var game;
  var canvas;

  beforeEach(function(){
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    game = new GameCore({
      canvas: canvas,
      //beforeUpdate: jasmine.createSpy('beforeUpdate')
    });
  });

  afterEach(function(){
    game.stop();
    document.body.removeChild(canvas);
  });

  it.skip('should default to FONT_SIZE of 24', function(){
    expect(game.statics.FONT_SIZE).toEqual(24);
  });

  it('should not be running', function(){
    expect(game.isRunning).toEqual(false);
  });

  it('should not have a canvasId by default', function(){
    expect(game.canvasId).toBe(null);
  });

  it('should default to maxStep of 40', function(){
    expect(game.maxStep).toEqual(40);
  });

  it('should default to contextType of 2d', function(){
    expect(game.contextType).toEqual('2d');
  });

  it('should default to height of 0', function(){
    expect(game.height).toEqual(0);
  });

  it('should default to width of 0', function(){
    expect(game.width).toEqual(0);
  });

  it('should not have a resourceManager by default', function(){
    expect(game.resourceManager).toBe(null);
  });

  it('should not have an inputManager by default', function(){
    expect(game.inputManager).toBe(null);
  });

  it('shoulf default to loadingForeground of #00F', function(){
    expect(game.loadingForeground).toEqual('#00F');
  });

  it('should default to loadingBackground to #FFF', function(){
    expect(game.loadingBackground).toEqual('#FFF');
  });

  it('should not have a gameAreaId by default', function(){
    expect(game.gameAreaId).toBe(null);
  });

  it('should default to canvasPercentage of 0', function(){
    expect(game.canvasPercentage).toEqual(0);
  });

  // TODO: should these be split out into their own tests?
  it('should have functions defined', function(){
    expect(game.setHeight).toExist();
    expect(game.setWidth).toExist();
    expect(game.stop).toExist();
    expect(game.run).toExist();
    expect(game.loadResources).toExist();
    expect(game.init).toExist();
    expect(game.initInput).toExist();
    expect(game.handleInput).toExist();
    expect(game.gameLoop).toExist();
    expect(game.launchLoop).toExist();
    expect(game.loopRunner).toExist();
    expect(game.update).toExist();
    expect(game.updateLoadingScreen).toExist();
    expect(game.draw).toExist();
    expect(game.drawLoadingScreen).toExist();
  });

  describe('GameCore.setHeight()', function(){

    it('should set the height of game and game.canvas when setHeight is called after init', function(){
      expect(game.height).toEqual(0);
      expect(game.canvas.height).toEqual(150);

      game.init();

      expect(game.height).toEqual(150);
      expect(game.canvas.height).toEqual(150);

      game.setHeight(300);

      expect(game.height).toEqual(300);
      expect(game.canvas.height).toEqual(300);
    });

  });

  describe('GameCore.setWidth()', function(){

    it('should set the width of game and game.canvas when setWidth is called after init', function(){
      expect(game.width).toEqual(0);
      expect(game.canvas.width).toEqual(300);

      game.init();

      expect(game.width).toEqual(300);
      expect(game.canvas.width).toEqual(300);

      game.setWidth(150);

      expect(game.width).toEqual(150);
      expect(game.canvas.width).toEqual(150);
    });

  });

  describe('GameCore.stop()', function(){

    it('should not be running after stop is called', function(){
      expect(game.isRunning).toEqual(false);

      game.run();

      expect(game.isRunning).toEqual(true);

      game.stop();

      expect(game.isRunning).toEqual(false);
    });

  });

  describe.skip('GameCore.run()', function(){

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
      expect(game.loadResources.calls.length).toEqual(2);
    });

    it('should call initInput with the inputManager when run is called', function(){
      expect(game.initInput).toHaveBeenCalledWith(game.inputManager);
    });

    it('should call launchLoop when run is called', function(){
      expect(game.launchLoop).toHaveBeenCalled();
    });

    it('should be running after run is called', function(){
      expect(game.isRunning).toEqual(true);
    });

  });

  describe.skip('GameCore.loadResources()', function(){

    beforeEach(function(){
      spyOn(game, 'loadResources');
    });

    it('should be called by game.run with the resourceManager', function(){
      game.run();

      expect(game.loadResources).toHaveBeenCalled();
      // TODO: change this to once
      expect(game.loadResources.calls.length).toEqual(2);
      expect(game.loadResources).toHaveBeenCalledWith(game.resourceManager);
    });

    it('should be called by game.init with the resourceManager', function(){
      game.init();

      expect(game.loadResources).toHaveBeenCalled();
      // We probably always want this to be 1, so remove the extra call from game.run()????
      expect(game.loadResources.calls.length).toEqual(1);
      expect(game.loadResources).toHaveBeenCalledWith(game.resourceManager);
    });

  });

  describe.skip('GameCore.init()', function(){

    it('should retrieve a canvas element by ID if canvas isn\'t specified', function(){
      game.canvas = null;
      game.canvasId = 'testCanvas';

      // Canvas in the DOM
      var canvas = document.createElement('canvas');
      canvas.id = 'testCanvas';
      document.body.appendChild(canvas);

      expect(game.canvas).toBe(null);

      game.init();

      expect(game.canvas).toEqual(canvas);

      // Cleanup
      document.body.removeChild(canvas);
    });

    it('should show alert message if canvas is not available', function(){
      game.canvas = null;
      game.canvasId = 'testCanvas';

      spyOn(window, 'alert');

      expect(game.canvas).toBe(null);

      game.init();

      expect(window.alert).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Sorry, your browser does not support canvas.  I recommend any browser but Internet Explorer');
      expect(window.alert.calls.length).toEqual(1);
    });

    it('should show alert message if context is not available', function(){
      game.contextType = 'unknown';

      spyOn(window, 'alert');

      expect(game.context).toEqualUndefined();

      game.init();

      expect(window.alert).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Sorry, your browser does not support a unknown drawing surface on canvas.  I recommend any browser but Internet Explorer');
      expect(window.alert.calls.length).toEqual(1);
    });

    it('should retrieve a context from the canvas if one isn\'t specified', function(){
      game.context = null;

      var context = game.canvas.getContext(game.contextType);

      expect(game.context).toBe(null);

      game.init();

      expect(game.context).toEqual(context);
    });

    it('should have a height of 150 and width of 300 (when neither were specified) after init is called', function(){
      expect(game.height).toEqual(0);
      expect(game.width).toEqual(0);

      game.init();

      expect(game.height).toEqual(150);
      expect(game.width).toEqual(300);
    });

    it('should contain a new instance of InputManger as inputManager property after init is called', function(){
      expect(game.inputManager instanceof InputManager).toEqual(false);

      game.init();

      expect(game.inputManager instanceof InputManager).toEqual(true);
    });

    it('should instantiate an InputManager with gameArea and canvasPercentage if configured on game', function(){
      // Canvas in the DOM
      var gameArea = document.createElement('div');
      gameArea.id = 'gameArea';
      document.body.appendChild(gameArea);

      game.gameAreaId = 'gameArea';
      game.canvasPercentage = 0.95;

      expect(game.inputManager).toBe(null);

      game.init();

      expect(game.inputManager.gameArea).toEqual(gameArea);
      expect(game.inputManager.canvasPercentage).toEqual(0.95);

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

      expect(game.inputManager).toEqual(im);
      expect(game.inputManager).nottoEqual(im2);

      game.init();

      expect(game.inputManager).toEqual(im);
      expect(game.inputManager).nottoEqual(im2);
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
      expect(game.resourceManager instanceof ResourceManager).toEqual(false);

      game.init();

      expect(game.resourceManager instanceof ResourceManager).toEqual(true);
    });

    it('should not instantiate a new ResourceManager if one is supplied before init', function(){
      var rm  = new ResourceManager();
      var rm2 = new ResourceManager();

      game.resourceManager = rm;

      expect(game.resourceManager).toEqual(rm);
      expect(game.resourceManager).nottoEqual(rm2);

      game.init();

      expect(game.resourceManager).toEqual(rm);
      expect(game.resourceManager).nottoEqual(rm2);
    });

  });

  describe.skip('GameCore.initInput()', function(){

    beforeEach(function() {
      spyOn(game, 'initInput');
    });

    it('should be called when run is called', function(){
      game.run();

      expect(game.initInput).toHaveBeenCalled();
      expect(game.initInput).toHaveBeenCalledWith(game.inputManager);
    });

  });

  describe.skip('GameCore.handleInput()', function(){
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

  describe.skip('GameCore.gameLoop()', function(){
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

  describe.skip('GameCore.beforeUpdate()', function(){

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

  describe.skip('GameCore.update()', function(){
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
