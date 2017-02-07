/*
 * Gruntfile
 * http://www.imatlopez.com/
 * Copyright 2014-2017 Matias Lopez
 * Licensed under MIT (https://github.com/imatlopez.github.io/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  var autoprefixerSettings = require('./grunt/autoprefixer-settings.js');
  var autoprefixer = require('autoprefixer')(autoprefixerSettings);

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*\n' +
      ' * Marvis v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
      ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * Licensed under <%= pkg.license %> (<%= pkg.repository.url %>/blob/master/LICENSE)\n' +
      ' */\n',

    clean: {
      build: ['public/styles/*.css']
    },

    // CSS build configuration

    scsslint: {
      allFiles: [
        'styles/*/*.scss'
      ],
      options: {
        bundleExec: false,
        colorizeOutput: true,
        config: '.scss-lint.yml',
        reporterOutput: null
      }
    },

    sass: {
      options: {
        includePaths: ['styles/'],
        precision: 6,
        sourceComments: false,
        sourceMap: true,
        outputStyle: 'expanded'
      },
      build: {
        files: {
          'public/styles/metoo.css': 'styles/metoo/style.scss'
        }
      }
    },

    postcss: {
      build: {
        options: {
          map: true,
          processors: [autoprefixer]
        },
        src: 'public/styles/*.css'
      }
    },

    stamp: {
      options: {
        banner: '<%= banner %>\n'
      },
      src: [
        'public/styles/metoo.css'
      ]
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      build: {
        expand: true,
        cwd: 'public/styles/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/styles/'
      }
    },

    cssmin: {
      options: {
        sourceMap: true,
        advanced: false
      },
      build: {
        files: [
          {
            expand: true,
            cwd: 'public/styles/',
            src: ['*.css', '!*.min.css'],
            dest: 'public/styles/',
            ext: '.min.css'
          }
        ]
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    }

  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    pattern: 'grunt-*'
  });
  require('time-grunt')(grunt);
  // Test buildribution task.
  grunt.registerTask('test-scss', ['scsslint']);
  grunt.registerTask('test', ['test-scss']);

  // CSS buildribution task.
  grunt.registerTask('build-css', ['sass', 'postcss', 'csscomb', 'stamp', 'cssmin']);

  // Full buildribution task.
  grunt.registerTask('build', ['clean', 'build-css']);

  // Default task.
  grunt.registerTask('default', ['test', 'build']);
};
