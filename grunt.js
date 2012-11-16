/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    test: {
      files: ['test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    dojo: {
      frozen: {
        dojo: '../../dojo/dojo-release-1.8.0-src/dojo/dojo.js',
        profile: 'frozen.profile.js',
        cwd: './'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    }
  });

  grunt.loadNpmTasks('grunt-dojo');

  // Default task.
  grunt.registerTask('default', 'lint test');

};
