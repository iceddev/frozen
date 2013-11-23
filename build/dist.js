({
  name: "frozen",
  include: [
    // box2d
    'frozen/box2d/BoxGame',
    'frozen/box2d/entities',
    'frozen/box2d/joints',
    // plugins
    'frozen/plugins/loadImage',
    'frozen/plugins/loadSound',
    // reiner
    'frozen/reiner/Creature',
    // utils
    'frozen/utils',
    // 'dojo/keys',
    //shims
    'frozen/shims/getGamepads'
  ],
  out: "../dist/frozen.js",
  optimize: 'none',
  generateSourceMaps: true,
  preserveLicenseComments: true,
  mainConfigFile: '../require-config.js'
})
