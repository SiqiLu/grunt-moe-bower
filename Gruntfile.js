/*
 * grunt-moe-bower
 * https://github.com/SiqiLu/grunt-moe-bower
 *
 * Copyright (c) 2015 Siqi Lu
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      grunt: {
        src: ['Gruntfile.js', 'grunt/**/*.js']
      },
      core: {
        src: ['tasks/**/*.js', '!src/**/*.min.js']
      },
      test: {
        src: ['tests/**/*.js', '!tests/**/*.min.js']
      }
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      core: {
        src: '<%= jshint.core.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin master',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },

    exec: {
      options: {
        stdout: true,
        stderr: true
      },
      npmUpdate: {
        command: 'npm update'
      },
      npmInstall: {
        command: 'npm install'
      },
      npmPublish: {
        command: 'npm publish'
      }
    },

    // Configuration to be run (and then tested).
    mbower: {
      defaultOptions: {
        options: {
          cleanTargetDir: false,
          cleanBowerDir: false,
          copy: true,
          install: true,
          targetDir: './wwwroot/'
        }
      },
      customOptions: {
        options: {
          cleanTargetDir: true,
          cleanBowerDir: true,
          copy: true,
          install: true,
          targetDir: './wwwroot/'
        }
      }
    }

  });

  // This command registers the default task which will install bower packages into wwwroot/lib
  grunt.registerTask('default', ['js', 'build']);

  grunt.registerTask('js', ['jshint', 'jscs']);
  grunt.registerTask('build', ['mbower']);
  grunt.registerTask('release', ['exec:npmUpdate', 'bump', 'exec:npmPublish']);
  grunt.registerTask('release-minor', ['exec:npmUpdate', 'bump:minor', 'exec:npmPublish']);
  grunt.registerTask('release-major', ['exec:npmUpdate', 'bump:major', 'exec:npmPublish']);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });
  require('time-grunt')(grunt);

};
