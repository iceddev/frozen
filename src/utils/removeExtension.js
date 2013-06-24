define(function(){

  'use strict';

  return function removeExtension(path){
    // only strips off extensions that have length of 4 or less
    // regex from http://stackoverflow.com/questions/1818310/regular-expression-to-remove-a-files-extension
    return path.replace(/(.*)\.[^.]{1,4}$/, '');
  };

});