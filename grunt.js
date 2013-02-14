/*global module:false*/
module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'specs/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine'
    },
    dojo: {
      frozen: {
        dojo: 'deps/dojo/dojo.js',
        profile: 'frozen.profile.js',
        'package': './',
        dojoConfig: 'dojoConfig.js',
        cwd: './'
      }
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'doc'
      }
    },
    jasmine: {
      src: 'src/**/*.js',
      specs: 'specs/**/*Spec.js',
      amd: true,
      helpers: [
        'dojoConfig.js',
        'deps/dojo/dojo.js'
      ],
      timeout: 10000,
      phatomjs: {
        'ignore-ssl-errors': true
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
        Box2D: true,
        expect: true,
        describe: true,
        it: true,
        beforeEach: true,
        afterEach: true,
        spyOn: true,
        runs: true,
        waitsFor: true,
        jasmine: true,
        xdescribe: true,
        xit: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-dojo');

  grunt.loadNpmTasks('grunt-jsdoc-plugin');

  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Default task.
  grunt.registerTask('default', 'lint jasmine');

};
