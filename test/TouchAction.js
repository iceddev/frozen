'use strict';

const TouchAction = require('../TouchAction');
const GameAction = require('../GameAction');
const expect = require('expect');

describe('TouchAction', function(){
  var touchAction;
  var points = [{
    x: 12,
    y: 12
  }];

  beforeEach(function(){
    touchAction = new TouchAction();
  });

  it('should inherit from GameAction', function(){
    expect(touchAction instanceof GameAction).toBe(true);
  });

  it('should not have a startPosition by default', function(){
    expect(touchAction.startPositions).toBe(null);
  });

  it('should not have an endPosition by default', function(){
    expect(touchAction.endPositions).toBe(null);
  });

  it('should not have a position by default', function(){
    expect(touchAction.positions).toBe(null);
  });

  it('should set startPosition and position when press is called', function(){
    touchAction.press(points);
    expect(touchAction.startPositions).toBe(points);
    expect(touchAction.positions).toBe(points);
  });

  it('should set endPosition when release is called', function(){
    touchAction.release(points);
    expect(touchAction.endPositions).toBe(points);
  });

});

