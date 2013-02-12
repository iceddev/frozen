define(function(){

  'use strict';

  return function parseString(resource){
    if(resource.indexOf('{') === 0 && resource.lastIndexOf('}') === resource.length - 1){
      resource = JSON.parse(resource.replace(/,/g, '","').replace(/:(?!\/\/)/g, '":"').replace(/\{/, '{"').replace(/\}/, '"}'));
    } else if(resource.indexOf('[') === 0 && resource.lastIndexOf(']') === resource.length - 1){
      resource = JSON.parse(resource.replace(/,/g, '","').replace(/\[/g, '["').replace(/\]/g, '"]'));
    }

    return resource;
  };

});