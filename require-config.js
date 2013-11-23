requirejs.config({
  baseUrl: './',
  paths: {
    'domReady': './deps/domReady'
  },
  packages: [
    { name: 'dcl', location: './deps/dcl', main: 'dcl' },
    { name: 'lodash', location: './deps/lodash/modern' },
    { name: 'hammer', location: './deps/hammer', main: 'hammer' },
    { name: 'on', location: './deps/on' },
    { name: 'frozen', location: './src', main: 'GameCore' }
  ]
});
