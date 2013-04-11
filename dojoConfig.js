var dojoConfig = {
  baseUrl: './',
  packages: [
    { name: 'dojo', location: 'deps/dojo' },
    { name: 'dcl', location: 'deps/dcl', main: 'dcl' },
    { name: 'lodash', location: 'deps/lodash', main: 'lodash' },
    { name: 'frozen', location: './src', main: 'GameCore' }
  ],
  async: true
};