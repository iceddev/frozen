define([
  'dcl',
  './Creature',
  'frozen/plugins/loadImage!images/girl/walking_b.png'
], function(dcl, Creature, img){

  'use strict';

  return dcl(Creature, {
    x: 60,
    y: 40,
    img: img,
    id: 'girl'
  });

});