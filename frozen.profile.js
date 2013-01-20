var profile = (function(){

  'use strict';

  var miniExcludes = {
    'frozen/package': 1
  };

  return {
    basePath: "./",
    releaseDir: "libs",
    action: "release",
    layerOptimize: "closure",
    mini: true,
    selectorEngine: "acme",

    dojoBootText: "(function(){ require({cache:{}}); require.boot && require.apply(null, require.boot); })();",

    packages: [
      { name: 'dojo', location: 'deps/dojo' },
      { name: 'dcl', location: 'deps/dcl', main: 'dcl' },
      { name: 'frozen', location: './src', main: 'GameCore' }
    ],

    defaultConfig: {
      hasCache:{
        "dojo-built": 1,
        "dojo-loader": 1,
        "dom": 1,
        "host-browser": 1,
        "config-selectorEngine": "acme"
      },
      async: 1
    },

    staticHasFeatures: {
      "config-deferredInstrumentation": 0,
      "config-dojo-loader-catches": 0,
      "config-tlmSiblingOfDojo": 0,
      "dojo-amd-factory-scan": 0,
      "dojo-cdn": 0,
      "dojo-combo-api": 0,
      "dojo-config-api": 1,
      "dojo-config-require": 0,
      "dojo-debug-messages": 0,
      "dojo-dom-ready-api": 1,
      "dojo-firebug": 0,
      "dojo-guarantee-console": 0,
      "dojo-has-api": 1,
      "dojo-inject-api": 1,
      "dojo-loader": 1,
      "dojo-log-api": 0,
      "dojo-modulePaths": 0,
      "dojo-moduleUrl": 0,
      "dojo-publish-privates": 0,
      "dojo-requirejs-api": 0,
      "dojo-sniff": 0,
      "dojo-sync-loader": 0,
      "dojo-test-sniff": 0,
      "dojo-timeout-api": 0,
      "dojo-trace-api": 0,
      "dojo-undef-api": 0,
      "dojo-v1x-i18n-Api": 1,
      "dom": 1,
      "host-browser": 1,
      "extend-dojo": 1,
      "dom-addeventlistener": 1,
      "csp-restrictions": 1,
      // We Shouldn't need to work around this bug for IE>8 according to:
      // https://javascriptweblog.wordpress.com/2011/01/04/exploring-javascript-for-in-loops/
      "bug-for-in-skips-shadowed": 0,
      // We are only supporting IE>8
      "ie": 9,
      // We don't support quirks mode
      "quirks": 0,
      // Only support devices that run at least jscript 9
      // https://en.wikipedia.org/wiki/JScript
      "jscript": 9
    },

    layers: {
      "dojo/dojo": {
        include: [],
        customBase: true
      },
      "dist/frozen": {
        include: [
          'frozen/box2d/Box',
          'frozen/box2d/CircleEntity',
          'frozen/box2d/Entity',
          'frozen/box2d/PolygonEntity',
          'frozen/box2d/MultiPolygonEntity',
          'frozen/box2d/RectangleEntity',
          'frozen/reiner/Creature',
          'frozen/AnimFrame',
          'frozen/Animation',
          'frozen/GameAction',
          'frozen/MouseAction',
          'frozen/GameCore',
          'frozen/InputManager',
          'frozen/ResourceManager',
          'frozen/shims/AudioContext',
          'frozen/shims/RAF',
          'frozen/Sprite',
          'frozen/utils',
          'dojo/keys'
        ],
        customBase: true,
        boot: true
      }
    },

    resourceTags: {
      miniExclude: function(filename, mid){
        return mid in miniExcludes;
      },
      amd: function(filename, mid) {
        return (/\.js$/).test(filename);
      }
    }
  };
})();