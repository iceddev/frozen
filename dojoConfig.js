var dojoConfig = {
  baseUrl: './',
  packages: [
    { name: 'dojo', location: 'deps/dojo' },
    { name: 'dcl', location: 'deps/dcl', main: 'dcl' },
    { name: 'lodash', location: 'deps/lodash/modern' },
    { name: 'on', location: 'deps/on' },
    { name: 'hammer', location: 'deps/hammer', main: 'hammer' },
    { name: 'frozen', location: './src', main: 'GameCore' }
  ],
  async: true
};
