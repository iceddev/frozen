define([
  'frozen/GameAction'
], function(GameAction){

  'use strict';

  describe('GameAction', function(){
    var gameAction;

    beforeEach(function(){
      gameAction = new GameAction();
    });

    it('should not have a name by default', function(){
      expect(gameAction.name).toBeNull();
    });

    it('should have a default behavior of 0', function(){
      expect(gameAction.behavior).toBe(0);
    });

    it('should have a default amount of 0', function(){
      expect(gameAction.amount).toBe(0);
    });

    it('should have a default state of 0', function(){
      expect(gameAction.state).toBe(0);
    });

    it('should have an enumeration of statics', function(){
      expect(gameAction.statics).toEqual({
        NORMAL: 0,
        DETECT_INITAL_PRESS_ONLY: 1,
        STATE_RELEASED: 0,
        STATE_PRESSED: 1,
        STATE_WAITING_FOR_RELEASE: 2,
        STATE_MOVED: 3
      });
    });

    // TODO: should these be split out into their own tests?
    it('should have functions defined', function(){
      expect(gameAction.constructor).toBeDefined();
      expect(gameAction.reset).toBeDefined();
      expect(gameAction.tap).toBeDefined();
      expect(gameAction.press).toBeDefined();
      expect(gameAction.pressAmt).toBeDefined();
      expect(gameAction.release).toBeDefined();
      expect(gameAction.isPressed).toBeDefined();
      expect(gameAction.getAmount).toBeDefined();
    });

    describe('GameAction.constructor()', function(){

      beforeEach(function(){
        spyOn(gameAction, 'reset');
      });

      it('should call reset when called', function(){
        gameAction.constructor();

        expect(gameAction.reset).toHaveBeenCalled();
      });

    });

    describe('GameAction.reset()', function(){

      it('should set state to the value of STATE_RELEASED', function(){
        expect(gameAction.state).toBe(0);

        gameAction.state = 1;

        expect(gameAction.state).toBe(1);

        gameAction.reset();

        expect(gameAction.state).toBe(gameAction.statics.STATE_RELEASED);
      });

      it('should set the amount to 0', function(){
        expect(gameAction.amount).toBe(0);

        gameAction.amount = 2;

        expect(gameAction.amount).toBe(2);

        gameAction.reset();

        expect(gameAction.state).toBe(0);
      });

    });

    describe('GameAction.tap()', function(){

      beforeEach(function(){
        spyOn(gameAction, 'press');
        spyOn(gameAction, 'release');

        gameAction.tap();
      });

      it('should call press when called', function(){
        expect(gameAction.press).toHaveBeenCalled();
      });

      it('should call release when called', function(){
        expect(gameAction.release).toHaveBeenCalled();
      });

    });

    describe('GameAction.press()', function(){

      beforeEach(function(){
        spyOn(gameAction, 'pressAmt');
      });

      it('should set the state to value of STATE_PRESSED when called', function(){
        expect(gameAction.state).toBe(0);

        gameAction.state = 2;

        expect(gameAction.state).toBe(2);

        gameAction.press();

        expect(gameAction.state).toBe(gameAction.statics.STATE_PRESSED);
      });

      it('should not call pressAmt when behavior is not set to value of DETECT_INITAL_PRESS_ONLY', function(){
        gameAction.press();

        expect(gameAction.pressAmt).not.toHaveBeenCalled();
      });

      it('should call pressAmt with 1 as parameter when behavior is set to the value of DETECT_INITAL_PRESS_ONLY', function(){
        gameAction.behavior = gameAction.statics.DETECT_INITAL_PRESS_ONLY;
        gameAction.press();

        expect(gameAction.pressAmt).toHaveBeenCalled();
        expect(gameAction.pressAmt).toHaveBeenCalledWith(1);
      });

    });

    describe('GameAction.pressAmt()', function(){

      it('should not add to amount or change state when state is set to value of STATE_WAITING_FOR_RELEASE', function(){
        gameAction.state = gameAction.statics.STATE_WAITING_FOR_RELEASE;

        expect(gameAction.amount).toBe(0);
        expect(gameAction.state).toBe(gameAction.statics.STATE_WAITING_FOR_RELEASE);

        gameAction.pressAmt(2);

        expect(gameAction.amount).toBe(0);
        expect(gameAction.state).toBe(gameAction.statics.STATE_WAITING_FOR_RELEASE);
      });

      it('should add the amount and change state to value of STATE_WAITING_FOR_RELEASE when state is not STATE_WAITING_FOR_RELEASE', function(){
        expect(gameAction.amount).toBe(0);
        expect(gameAction.state).toBe(0);

        gameAction.pressAmt(2);

        expect(gameAction.amount).toBe(2);
        expect(gameAction.state).toBe(gameAction.statics.STATE_WAITING_FOR_RELEASE);
      });

    });

    describe('GameAction.release()', function(){

      it('should change the state to value of STATE_RELEASED', function(){
        expect(gameAction.state).toBe(0);

        gameAction.release();

        expect(gameAction.state).toBe(gameAction.statics.STATE_RELEASED);
      });

    });

    describe('GameAction.isPressed()', function(){

      it('should return true if state is value of STATE_PRESSED', function(){
        gameAction.state = gameAction.statics.STATE_PRESSED;

        expect(gameAction.isPressed()).toBe(true);
      });

      it('should return false if state is not value of STATE_PRESSED', function(){
        gameAction.state = gameAction.statics.STATE_RELEASED;

        expect(gameAction.isPressed()).toBe(false);
      });

    });

    describe('GameAction.getAmount()', function(){

      it('should return 0 if amount is 0', function(){
        expect(gameAction.getAmount()).toBe(0);
      });

      it('should return the amount', function(){
        expect(gameAction.getAmount()).toBe(0);

        gameAction.amount = 1;

        expect(gameAction.getAmount()).toBe(1);

        gameAction.pressAmt(2);

        expect(gameAction.getAmount()).toBe(2);
      });

      it('should set amount to 0 if state is value of STATE_RELEASED', function(){
        gameAction.amount = 1;

        var amt = gameAction.getAmount();

        expect(amt).toBe(1);
        expect(gameAction.state).toBe(gameAction.statics.STATE_RELEASED);
        expect(gameAction.amount).toBe(0);
      });

      it('should set amount to 0 and state to value of STATE_WAITING_FOR_RELEASE if behavior is set to value of DETECT_INITAL_PRESS_ONLY and state is not STATE_RELEASED', function(){
        gameAction.amount = 1;
        gameAction.state = gameAction.statics.STATE_PRESSED;
        gameAction.behavior = gameAction.statics.DETECT_INITAL_PRESS_ONLY;

        var amt = gameAction.getAmount();

        expect(amt).toBe(1);
        expect(gameAction.state).toBe(gameAction.statics.STATE_WAITING_FOR_RELEASE);
        expect(gameAction.amount).toBe(0);
      });

      it('should not change amount or state when state is not STATE_RELEASED and behavior is not DETECT_INITAL_PRESS_ONLY', function(){
        gameAction.amount = 1;
        gameAction.state = gameAction.statics.STATE_PRESSED;

        var amt = gameAction.getAmount();

        expect(amt).toBe(1);
        expect(gameAction.state).toBe(gameAction.statics.STATE_PRESSED);
        expect(gameAction.amount).toBe(1);
      });

    });

  });

});