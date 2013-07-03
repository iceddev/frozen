/*jshint globalstrict:true*/
/*global module:false, process:false*/
'use strict';

var path = require('path');
var connectLR = require('connect-livereload');

// Workaround for Windows giving Error 108 (ERR_ADDRESS_INVALID) when opening 0.0.0.0
var hostname = process.platform !== 'win32' ? '0.0.0.0' : 'localhost';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      game: [
        'Gruntfile.js',
        'dojoConfig.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      dist: ['dist/', 'libs/'],
      deps: ['deps/', 'node_modules/'],
      all: ['<%= clean.dist %>', '<%= clean.deps %>']
    },
    connect: {
      game: {
        options: {
          middleware: function(connect, options) {
            return [connectLR(), connect.static(path.resolve(options.base))];
          }
        }
      },
      options: {
        hostname: hostname,
        port: 8000,
        keepalive: false
      }
    },
    open: {
      game: {
        path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/'
      }
    },
    watch: {
      game: {
        files: ['src/**/*.js', 'styles/**/*.css', 'dojoConfig.js', 'index.html'],
        tasks: ['jshint:game'],
        options: {
          livereload: true
        }
      }
    },
    dojo: {
      game: {},
      options: {
        dojo: 'deps/dojo/dojo.js',
        profile: 'game.profile.js',
        'package': './',
        dojoConfig: 'dojoConfig.js',
        cwd: './'
      }
    }
  });

  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint:game', 'connect:game', 'open:game', 'watch:game']);

  grunt.registerTask('build', ['jshint:game', 'dojo:game']);

};
