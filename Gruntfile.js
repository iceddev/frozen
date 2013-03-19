/*global module:false*/
module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    jshint: {
      test: [
        'src/**/*.js',
        'specs/**/*.js',
      ],
      docs: [
        'src/**/*.js'
      ],
      examples: [
        'src/**/*.js',
        'specs/**/*.js',
        'examples/**/*.js'
      ],
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'specs/**/*.js',
        'examples/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    connect: {
      test: {},
      docs: {},
      examples: {},
      all: {
        options: {
          keepalive: true
        }
      },
      options: {
        hostname: '0.0.0.0',
        port: 8000,
        keepalive: false
      }
    },
    open: {
      test: {
        path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/_SpecRunner.html'
      },
      docs: {
        path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/docs/'
      },
      examples: {
        path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/examples/'
      }
    },
    watch: {
      test: {
        files: '<%= jshint.test %>',
        tasks: ['jshint:test', 'jasmine:all', 'jasmine:all:build', 'open:test']
      },
      docs: {
        files: '<%= jshint.docs %>',
        tasks: ['jshint:docs', 'jsdoc:all']
      },
      examples: {
        files: '<%= jshint.examples %>',
        tasks: ['jshint:examples', 'dojo']
      },
      all: {
        files: '<%= jshint.all %>',
        tasks: ['build']
      }
    },
    dojo: {
      frozen: {},
      options: {
        dojo: 'deps/dojo/dojo.js',
        profile: 'frozen.profile.js',
        'package': './',
        dojoConfig: 'dojoConfig.js',
        cwd: './'
      }
    },
    jsdoc: {
      all: {
        src: ['src/**/*.js', 'README.md'],
        dest: 'docs',
        config: 'jsdoc_config.json'
      }
    },
    jasmine: {
      all: {
        options: {
          specs: 'specs/**/*Spec.js',
        }
      },
      options: {
        src: 'src/**/*.js',
        helpers: [
          'deps/Box2d.min.js',
          'dojoConfig.js',
          'deps/dojo/dojo.js'
        ],
        host: 'http://127.0.0.1:8000/',
        template: 'specs/fixtures/_SpecRunner.tmpl'
      }
    }
  });

  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint:all', 'connect:test', 'jasmine:all']);

  grunt.registerTask('build', ['jshint:all', 'connect:test', 'jasmine:all', 'jsdoc:all', 'dojo']);
  grunt.registerTask('test', ['jshint:test', 'connect:test', 'jasmine:all', 'jasmine:all:build', 'open:test', 'watch:test']);
  grunt.registerTask('docs', ['jshint:docs', 'jsdoc:all', 'connect:docs', 'open:docs', 'watch:docs']);
  grunt.registerTask('examples', ['jshint:examples', 'dojo', 'connect:examples', 'open:examples', 'watch:examples']);

};
