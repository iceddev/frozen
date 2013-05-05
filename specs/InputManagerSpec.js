define([
  'frozen/InputManager',
  'frozen/MouseAction',
  'frozen/TouchAction',
  'frozen/GameAction',
  'frozen/utils/insideCanvas'
], function(InputManager, MouseAction, TouchAction, GameAction, insideCanvas){

  'use strict';

  describe('InputManager', function(){
    var im;
    var gameAction;
    var mockKeyPress;
    var mockEvent;
    var canvas;

    beforeEach(function(){
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      im = new InputManager({
        canvas: canvas
      });
      gameAction = new GameAction();

      mockKeyPress = {
        keyCode: 'b'
      };

      mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        gesture: {
          touches: [
            {
              clientX: 12,
              clientY: 12
            }
          ]
        }
      };

      spyOn(im, 'normalizePoint').andReturn({
        x: 12,
        y: 12
      });
    });

    afterEach(function(){
      im.destroy();
      document.body.removeChild(canvas);
    });

    it('should default to empty array of keyActions', function(){
      expect(im.keyActions).toEqual([]);
      expect(Array.isArray(im.keyActions)).toBe(true);
      expect(im.keyActions.length).toBe(0);
    });

    it('should instantiate a MouseAction as mouseAction when emulateMouse is true', function(){
      expect(im.emulateMouse).toBe(true);
      expect(im.mouseAction instanceof MouseAction).toBe(true);
    });

    it('should instantiate a TouchAction as touchAction when emulateMouse is false', function(){
      im = new InputManager({
        canvas: canvas,
        emulateMouse: false
      });
      expect(im.emulateMouse).toBe(false);
      expect(im.touchAction instanceof TouchAction).toBe(true);
    });

    it('should not have a canvas as default', function(){
      im = new InputManager();
      expect(im.canvas).toBeNull();
    });

    it('should default to handleMouse of true', function(){
      expect(im.handleMouse).toBe(true);
    });

    it('should default of handleTouch of true', function(){
      expect(im.handleTouch).toBe(true);
    });

    it('should default to handleKeys of true', function(){
      expect(im.handleKeys).toBe(true);
    });

    it('should not have a gameArea by default', function(){
      expect(im.gameArea).toBeNull();
    });

    it('should not have a canvasPercentage by default', function(){
      expect(im.canvasPercentage).toBeNull();
    });

    // TODO: should these be split out into their own tests?
    it('should have functions defined', function(){
      expect(im.constructor).toBeDefined();
      expect(im.mapToKey).toBeDefined();
      expect(im.addKeyAction).toBeDefined();
      expect(im.mouseUp).toBeDefined();
      expect(im.mouseDown).toBeDefined();
      expect(im.mouseMove).toBeDefined();
      expect(im.touchStart).toBeDefined();
      expect(im.touchEnd).toBeDefined();
      expect(im.touchMove).toBeDefined();
      expect(im.getKeyAction).toBeDefined();
      expect(im.keyPressed).toBeDefined();
      expect(im.keyDown).toBeDefined();
      expect(im.keyReleased).toBeDefined();
      expect(im.getMouseLoc).toBeDefined();
      expect(im.resize).toBeDefined();
    });

    describe('InputManager.constructor()', function(){

      // TODO: find way to test that events were bound

    });

    describe('InputManager.mapToKey()', function(){

      it('should reset keyActions to an array if it is a falsey value', function(){
        im.keyActions = null;

        expect(im.keyActions).toBeFalsy();

        im.mapToKey(gameAction, 12);

        expect(Array.isArray(im.keyActions)).toBe(true);
      });

      it('should set the gameAction at the index related to keyCode passed in', function(){
        expect(im.keyActions.length).toBe(0);

        im.mapToKey(gameAction, 12);

        expect(im.keyActions.length).toBe(13);
        expect(im.keyActions[12]).toBe(gameAction);
      });

    });

    describe('InputManager.addKeyAction()', function(){

      beforeEach(function(){
        spyOn(im, 'mapToKey');
      });

      it('should instantiate a GameAction and pass it to mapToKey with the keyCode passed in', function(){
        var action = im.addKeyAction(12);

        expect(action instanceof GameAction).toBe(true);
        expect(im.mapToKey).toHaveBeenCalled();
        expect(im.mapToKey).toHaveBeenCalledWith(action, 12);
      });

      it('should return the GameAction instantiated', function(){
        var action = im.addKeyAction(12);

        expect(action).toEqual(im.keyActions[12]);
      });

      it('should set the behavior of GameAction to value of DETECT_INITAL_PRESS_ONLY if true is passed as second parameter', function(){
        var action = im.addKeyAction(12, true);

        expect(action.behavior).toBe(gameAction.statics.DETECT_INITAL_PRESS_ONLY);
      });

    });

    describe('InputManager.mouseUp()', function(){

      beforeEach(function(){
        spyOn(im.mouseAction, 'release').andCallThrough();

        im.mouseUp(mockEvent);
      });

      it('should call mouseActon.release', function(){
        expect(im.mouseAction.release).toHaveBeenCalled();
      });

      it('should call normalizePoint with event object passed in', function(){
        expect(im.normalizePoint).toHaveBeenCalled();
        expect(im.normalizePoint).toHaveBeenCalledWith(mockEvent.gesture.touches[0]);
      });

      it('should assign the value returned by normalizePoint to mouseAction.endPosition', function(){
        expect(im.mouseAction.endPosition).toEqual({
          x: 12,
          y: 12
        });
      });

    });

    describe('InputManager.mouseDown()', function(){
      var currentPoint;

      beforeEach(function(){
        im.canvas = {
          height: 400,
          width: 400
        };

        spyOn(im.mouseAction, 'press').andCallThrough();
        currentPoint = im.normalizePoint(mockEvent.gesture.touches[0]);

        im.mouseDown(mockEvent);
      });

      it('should call normalizePoint with event object passed in', function(){
        expect(im.normalizePoint).toHaveBeenCalled();
        expect(im.normalizePoint).toHaveBeenCalledWith(mockEvent.gesture.touches[0]);
      });

      it('should set mouseAction.endPosition to null', function(){
        expect(im.mouseAction.endPosition).toBeNull();
      });

      it('should assign the result of insideCanvas to mouseAction.insideCanvas', function(){
        var result = insideCanvas(currentPoint, im.canvas);

        expect(im.mouseAction.insideCanvas).toBe(result);
      });

      it('should call mouseAction.press if point is insideCanvas', function(){
        expect(im.mouseAction.press).toHaveBeenCalled();
      });

      it('should set the mouseAction.startPosition to the result of normalizePoint if point is inside canvas', function(){
        expect(im.mouseAction.startPosition).toEqual(currentPoint);
      });

      it('should set the mouseAction.position to the result of normalizePoint if point is inside canvas', function(){
        expect(im.mouseAction.position).toEqual(currentPoint);
      });

      // TODO: evaulate if this is the right way to handle things
      // it('should set the mouseAction.startPosition to null if point is outside canvas', function(){
      //   im.normalizePoint.andReturn({
      //     x: -12,
      //     y: -12
      //   });

      //   im.mouseDown(mockEvent);

      //   expect(im.mouseAction.startPosition).toBeNull();
      // });

    });

    describe('InputManager.mouseMove()', function(){
      var currentPoint;

      beforeEach(function(){
        currentPoint = im.normalizePoint(mockEvent);

        im.mouseMove(mockEvent);
      });

      it('should set mouseAction.position to the result of normalizePoint', function(){
        expect(im.mouseAction.position).toEqual(currentPoint);
      });

    });

    describe('InputManager.touchStart()', function(){
      var currentPoint;

      beforeEach(function(){
        im = new InputManager({
          canvas: canvas,
          emulateMouse: false
        });
        spyOn(im.touchAction, 'press').andCallThrough();
        currentPoint = im.normalizePoint(mockEvent.gesture.touches[0]);

        spyOn(im, 'normalizePoint').andCallThrough();
        im.touchStart(mockEvent);
      });

      it('should call normalizePoint with event object passed in', function(){
        expect(im.normalizePoint).toHaveBeenCalled();
        mockEvent.gesture.touches.forEach(function(evt, idx, col){
          expect(im.normalizePoint).toHaveBeenCalledWith(evt, idx, col);
        });
      });

      it('should set touchAction.endPositions to null', function(){
        expect(im.touchAction.endPositions).toBeNull();
      });

      it('should assign the result of insideCanvas to touchAction.insideCanvas if any points are inside canvas', function(){
        var result = insideCanvas(currentPoint, im.canvas);

        expect(im.touchAction.insideCanvas).toBe(result);
      });

      it('should call touchAction.press if point is insideCanvas', function(){
        expect(im.touchAction.press).toHaveBeenCalled();
      });

      it('should set the touchAction.startPositions to the result of normalizePoint if point is inside canvas', function(){
        expect(im.touchAction.startPositions).toEqual([currentPoint]);
      });

      it('should set the touchAction.position to the result of normalizePoint if point is inside canvas', function(){
        expect(im.touchAction.positions).toEqual([currentPoint]);
      });

      // TODO: evaulate if this is the right way to handle things
      // it('should set the touchAction.startPosition to null if point is outside canvas', function(){
      //   im.normalizePoint.andReturn({
      //     x: -12,
      //     y: -12
      //   });

      //   im.touchStart(mockEvent);

      //   expect(im.touchAction.startPosition).toBeNull();
      // });

    });

    describe('InputManager.touchEnd()', function(){

      beforeEach(function(){
        im = new InputManager({
          canvas: canvas,
          emulateMouse: false
        });
        spyOn(im.touchAction, 'release').andCallThrough();
        spyOn(im, 'normalizePoint').andReturn({
          x: 12,
          y: 12
        });

        im.touchEnd(mockEvent);
      });

      it('should call touchAction.release', function(){
        expect(im.touchAction.release).toHaveBeenCalled();
      });

      it('should call normalizePoint with event object passed in', function(){
        expect(im.normalizePoint).toHaveBeenCalled();
        mockEvent.gesture.touches.forEach(function(evt, idx, col){
          expect(im.normalizePoint).toHaveBeenCalledWith(evt, idx, col);
        });
      });

      it('should assign the values returned by normalizePoint to touchAction.endPositions', function(){
        expect(im.touchAction.endPositions).toEqual([{
          x: 12,
          y: 12
        }]);
      });

    });

    describe('InputManager.touchMove()', function(){
      var currentPoint;

      beforeEach(function(){
        im = new InputManager({
          canvas: canvas,
          emulateMouse: false
        });
        currentPoint = im.normalizePoint(mockEvent.gesture.touches[0]);

        im.touchMove(mockEvent);
      });

      it('should set touchAction.positions to the result of getMouseLoc', function(){
        expect(im.touchAction.positions).toEqual([currentPoint]);
      });

      it('should not call preventDefault on the event if touchAction.startPositions is not set', function(){
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('should call preventDefault on the event if touchAction.startPositions is set', function(){
        im.touchStart(mockEvent);

        im.touchMove(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
      });

    });

    describe('InputManager.getKeyAction()', function(){
      var keyAction;
      var gameAction;

      beforeEach(function(){
        gameAction = new GameAction();
        im.keyActions.b = gameAction;

        keyAction = im.getKeyAction(mockKeyPress);
      });

      it('should return the GameAction associated to the keyCode on the event', function(){
        expect(keyAction).toBe(gameAction);
      });

      it('should return null if there are no GameActions mapped to keyActions', function(){
        im.keyActions = [];

        keyAction = im.getKeyAction(mockKeyPress);

        expect(keyAction).toBeNull();
      });

    });

    describe('InputManager.keyPressed()', function(){
      var gameAction;

      beforeEach(function(){
        gameAction = new GameAction();
        im.keyActions.b = gameAction;

        spyOn(gameAction, 'press');

        im.keyPressed(mockKeyPress);
      });

      it('should call press on the GameAction associated with the keyCode', function(){
        expect(gameAction.press).toHaveBeenCalled();
      });

    });

    describe('InputManager.keyDown()', function(){
      var gameAction;

      beforeEach(function(){
        gameAction = new GameAction();
        im.keyActions.b = gameAction;

        spyOn(gameAction, 'press');

        im.keyDown(mockKeyPress);
      });

      it('should call press on the GameAction associated with the keyCode', function(){
        expect(gameAction.press).toHaveBeenCalled();
      });

    });

    describe('InputManager.keyReleased()', function(){
      var gameAction;

      beforeEach(function(){
        gameAction = new GameAction();
        im.keyActions.b = gameAction;

        spyOn(gameAction, 'release');

        im.keyReleased(mockKeyPress);
      });

      it('should call release on the GameAction associated with the keyCode', function(){
        expect(gameAction.release).toHaveBeenCalled();
      });

    });

    describe('InputManager.getMouseLoc()', function(){

      beforeEach(function(){
        im.getMouseLoc(mockEvent.gesture.touches[0]);
      });

      it('should pass event object through to normalizePoint', function(){
        expect(im.normalizePoint).toHaveBeenCalled();
        expect(im.normalizePoint).toHaveBeenCalledWith(mockEvent.gesture.touches[0]);
      });

    });

    describe('InputManager.normalizePoint()', function(){
      var mouseLoc;

      beforeEach(function(){
        im.canvas = document.createElement('canvas');

        im.canvas.style.position = 'absolute';
        im.canvas.style.top = '0';
        im.canvas.style.left = '0';

        document.body.appendChild(im.canvas);

        im.normalizePoint.andCallThrough();

        mouseLoc = im.normalizePoint(mockEvent.gesture.touches[0]);
      });

      afterEach(function(){
        document.body.removeChild(im.canvas);
      });

      it('should return the position of the event over the canvas', function(){
        expect(mouseLoc).toEqual({
          x: 12,
          y: 12
        });
      });

      it('should return the position of the event over the canvas divided by the zoomRatio', function(){
        im.zoomRatio = 2;

        mouseLoc = im.normalizePoint(mockEvent.gesture.touches[0]);

        expect(mouseLoc).toEqual({
          x: 6,
          y: 6
        });
      });

    });

    describe('InputManager.resize()', function(){

      beforeEach(function(){
        im.canvas = document.createElement('canvas');
        im.gameArea = document.createElement('div');
        im.canvasPercentage = 0.5;

        im.gameArea.appendChild(im.canvas);

        document.body.appendChild(im.gameArea);

        im.resize();
      });

      afterEach(function(){
        document.body.removeChild(im.gameArea);
      });

      it('should set the zoomRatio', function(){
        expect(im.zoomRatio).toBeDefined();
      });

      // TODO: test that gameArea styles are set

      it('should set the width, height, display, marginRight, and marginLeft on canvas', function(){
        expect(im.canvas.style.width).toBe('50%');
        expect(im.canvas.style.height).toBe('50%');
        expect(im.canvas.style.display).toBe('block');
        expect(im.canvas.style.marginRight).toBe('auto');
        expect(im.canvas.style.marginLeft).toBe('auto');
      });

    });

  });

});