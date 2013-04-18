define([
  'frozen/plugins/loadImage!specs/fixtures/luis_gangnam.jpg',
  'frozen/plugins/loadImage![specs/fixtures/luis_gangnam.jpg,specs/fixtures/luis_gangnam.jpg,specs/fixtures/luis_gangnam.jpg]',
  'frozen/plugins/loadImage!{img1:specs/fixtures/luis_gangnam.jpg,img2:specs/fixtures/luis_gangnam.jpg,img3:specs/fixtures/luis_gangnam.jpg}'
], function(singleImage, imageArray, imageObject){

  'use strict';

  describe('plugins/loadImage', function(){

    it('should load a single image', function(){
      expect(singleImage instanceof Image).toBe(true);
    });

    it('should load an array of images', function(){
      expect(Array.isArray(imageArray)).toBe(true);
      expect(imageArray.length).toBe(3);
      imageArray.forEach(function(image){
        expect(image instanceof Image).toBe(true);
      });
    });

    it('should load an object of images', function(){
      expect(Array.isArray(imageObject)).toBe(false);
      expect(typeof imageObject).toBe('object');
      Object.keys(imageObject).forEach(function(key){
        expect(['img1', 'img2', 'img3']).toContain(key);
      });
    });

  });

});