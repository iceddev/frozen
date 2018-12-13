const expect = require('expect');
const { AnimFrame, Animation } = frozenjs;


describe('AnimFrame', function(){
  var frame;

  beforeEach(function(){
    frame = new AnimFrame();
  });

  it('should default to endTime of 0', function(){
    expect(frame.endTime).toEqual(0);
  });

  it('should default to imgSlotX of 0', function(){
    expect(frame.imgSlotX).toEqual(0);
  });

  it('should default to imgSlotY of 0', function(){
    expect(frame.imgSlotY).toEqual(0);
  });

  it('should not have an image by default', function(){
    expect(frame.image).toEqual(null);
  });

  it('should mix in properties passed', function(){
    frame = new AnimFrame({
      endTime: 10,
      imgSlotX: 2,
      imgSlotY: 2,
      image: new Image(),
      mock: true
    });

    expect(frame.endTime).toEqual(10);
    expect(frame.imgSlotX).toEqual(2);
    expect(frame.imgSlotY).toEqual(2);
    expect(frame.image instanceof Image).toEqual(true);
    expect(frame.mock).toBeTruthy();
    expect(frame.mock).toEqual(true);
  });
});
