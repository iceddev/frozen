define([
  'frozen/utils/parseString'
], function(parseString){

  'use strict';

  describe('Parse String', function(){
    it('should return the same string if passed string doesn\'t start and end with {} or []', function(){
      var string = 'someFilename.jpg';
      var output = parseString(string);
      expect(output).toEqual(string);
    });

    it('should return an object if passed a string that starts and ends with {} and can be converted to parseable JSON', function(){
      var string = '{key1:someFilename.jpg}';
      var output = parseString(string);
      expect(output).toEqual({key1:'someFilename.jpg'});
    });

    it('should return an array if passed a string that starts and ends with [] and can be converted to parseable JSON', function(){
      var string = '[someFilename.jpg,someFilename2.jpg]';
      var output = parseString(string);
      expect(output).toEqual(['someFilename.jpg', 'someFilename2.jpg']);
    });

    it('should throw parse error if passed a string that starts and ends with {} and cannot be converted to parseable JSON', function(){
      var string = '{someFilename.jpg}';
      expect(function(){ parseString(string); }).toThrow();
    });

    it('should not add quotes around any URI, such as http:// or git://', function(){
      var string = '{url:http://github.com}';
      var output = parseString(string);
      expect(output).toEqual({url:'http://github.com'});
    });
  });

});