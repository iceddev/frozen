var dojoConfig = {
  baseUrl: './',
  packages: [
    { name: 'dojo', location: 'deps/dojo' },
    { name: 'dcl', location: 'deps/dcl', main: 'dcl' },
    // TODO: switch to modern
    { name: 'lodash', location: 'deps/lodash/compat', main: 'lodash' },
    { name: 'hammer', location: 'deps/hammer', main: 'hammer' },
    { name: 'frozen', location: './src', main: 'GameCore' }
  ],
  async: true
};
