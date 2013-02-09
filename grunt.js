/*global module:false*/
module.exports = function(grunt) {

  'use strict';

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
        dojo: 'deps/dojo/dojo.js',
        profile: 'frozen.profile.js',
        'package': './',
        cwd: './'
      }
    },
    jsdoc : {
      dist : {
        src: ['src/**/*.js'],
        dest: 'doc'
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
        undef: true,
        boss: true,
        es5: true,
        strict: true,
        trailing: true,
        loopfunc: true,
        // Enviroments
        browser: true,
        devel: true
      },
      globals: {
        define: true,
        require: true,
        Box2D: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-dojo');

  grunt.loadNpmTasks('grunt-jsdoc-plugin');

  // Default task.
  grunt.registerTask('default', 'lint test');

};
