var dojoConfig = {
  baseUrl: './',
  packages: [
    { name: 'dojo', location: '../../deps/dojo' },
    { name: 'dcl', location: '../../deps/dcl', main: 'dcl' },
    { name: 'lodash', location: '../../deps/lodash/modern' },
    { name: 'on', location: '../../deps/frozen-on' },
    { name: 'hammer', location: '../../deps/hammer', main: 'hammer' },
    { name: 'frozen', location: '../../deps/frozen/src', main: 'GameCore' },
    { name: 'game', location: 'src', main: 'game' },
    { name: 'sounds', location: 'resources/sfx' },
    { name: 'resources', location: 'resources' }
  ],
  deps: ['game'],
  async: true
};
