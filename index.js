'use strict';

var frozen = {
  GameCore : require('./GameCore'),
  InputManager : require('./InputManager'),
  ResourceManager : require('./ResourceManager'),
  MouseAction : require('./MouseAction'),
  TouchAction : require('./TouchAction'),
  keys : require('./keys'),
  Animation: require('./Animation'),
  AnimFrame: require('./AnimFrame'),
  utils : require('./utils'),
  Sprite : require('./Sprite'),
  reiner : {
    Creature : require('./reiner/Creature')
  },
  sounds : {
    HTML5Audio : require('./sounds/HTML5Audio'),
    WebAudio : require('./sounds/WebAudio')
  },
  box2d : {
    entities : require('./box2d/entities'),
    joints: require('./box2d/joints'),
    Box : require('./box2d/Box'),
    BoxGame : require('./box2d/BoxGame')
  }

};

module.exports = frozen;
