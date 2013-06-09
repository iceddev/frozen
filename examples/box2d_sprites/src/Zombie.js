define([
  'dcl',
  './Creature',
  'frozen/plugins/loadImage!images/greenZombie/walking_b.png'
], function(dcl, Creature, img){

  'use strict';

  return dcl(Creature, {
    img: img
  });

});