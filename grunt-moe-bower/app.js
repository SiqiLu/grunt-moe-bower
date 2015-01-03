﻿/*
 * grunt-bower-task
 * https://github.com/yatskevich/grunt-bower-task
 *
 * Copyright (c) 2012 Ivan Yatskevich
 * Licensed under the MIT license.
 */

'use strict';
             
var moePackage = function (grunt) {

    grunt = this;
    var bower;
    var path;
    var async;
    var colors;
    var rimraf;
    var bowerAssets;
    var assetCopier;
    var layoutsManager;

    function requireDependencies() {
        bower = require('bower');
        path = require('path');
        async = require('async');
        colors = require('colors');
        rimraf = require('rimraf').sync;
        bowerAssets = require('./lib/bower_assets');
        assetCopier = require('./lib/asset_copier');
        layoutsManager = require('./lib/layouts_manager');
    }

    function log(message) {
        grunt.log.writeln(message);
    }

    function fail(error) {
        grunt.fail.fatal(error);
    }
    
    function clean(dir, callback) {
        rimraf(dir);
        callback();
    }
    
    function install(options, callback) {
        bower.commands.install([], options.bowerOptions)
      .on('log', function (result) {
            log(['bower', result.id.cyan, result.message].join(' '));
        })
      .on('error', fail)
      .on('end', callback);
    }
    
    function copy(options, callback) {
        var bowerAssets = new bowerAssets(bower, options.cwd);
        bowerAssets.on('end', function (assets) {
            var copier = new assetCopier(assets, options, function (source, destination, isFile) {
                log('grunt-bower ' + 'copying '.cyan + ((isFile ? '' : ' dir ') + source + ' -> ' + destination).grey);
            });
            
            copier.once('copied', callback);
            copier.copy();
        }).get();
    }
    
    grunt.registerMultiTask('bower', 'Install Bower packages.', function () {
        var tasks = [],
            done = this.async(),
            options = this.options({
                cleanTargetDir: false,
                cleanBowerDir: false,
                targetDir: './lib',
                layout: 'byType',
                install: true,
                verbose: false,
                copy: true,
                bowerOptions: {}
            }),
            add = function (successMessage, fn) {
                tasks.push(function (callback) {
                    fn(function () {
                        grunt.log.ok(successMessage);
                        callback();
                    });
                });
            },
            bowerDir,
            targetDir;
        
        // calling require on the dependencies has been delayed to prevent slow
        // dependencies delaying the startup of grunt even if this task is not used
        // at all
        requireDependencies();
        
        bowerDir = path.resolve(bower.config.directory);
        targetDir = path.resolve(options.targetDir);
        
        log.logger = options.verbose ? grunt.log : grunt.verbose;
        options.layout = layoutsManager.getLayout(options.layout, fail);
        options.cwd = grunt.option('base') || process.cwd();
        
        if (options.cleanup !== undefined) {
            options.cleanTargetDir = options.cleanBowerDir = options.cleanup;
        }
        
        if (options.cleanTargetDir) {
            add('Cleaned target dir ' + targetDir.grey, function (callback) {
                clean(targetDir, callback);
            });
        }
        
        if (options.install) {
            add('Installed bower packages', function (callback) {
                install(options, callback);
            });
        }
        
        if (options.copy) {
            add('Copied packages to ' + targetDir.grey, function (callback) {
                copy(options, callback);
            });
        }
        
        if (options.cleanBowerDir) {
            add('Cleaned bower dir ' + bowerDir.grey, function (callback) {
                clean(bowerDir, callback);
            });
        }
        
        async.series(tasks, done);
    });
};

module.exports = moePackage;