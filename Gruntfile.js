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
            all: [
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
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

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'mbower']);

};
