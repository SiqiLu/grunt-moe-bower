/*
 * grunt-moe-bower
 * https://github.com/SiqiLu/grunt-moe-bower
 *
 * Copyright (c) 2015 SiqiLu
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        fs = require('fs'),
        async = require('async'),
        chalk = require('chalk'),
        bower = require('bower'),
        rimraf = require('rimraf').sync,
        _ = require('lodash');

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
            .on('log', function(result) {
                log(['bower', chalk.cyan(result.id), result.message].join(' '));
            })
            .on('error', fail)
            .on('end', callback);
    }

    function copy(options, callback) {
        var packages = [],
            tally = {
                pkgs: 0,
                files: 0
            },
            bowerDir = options.bowerDir,
            targetDir = options.targetDir;

        if (!grunt.file.exists(bowerDir)) {
            log('Can not find bower_components folder. Copy skipped.');
            return;
        }

        _(fs.readdirSync(bowerDir)).uniq().remove(function(item) {
            return !grunt.file.isDir(item) && grunt.file.exists(bowerDir, item, '.bower.json');
        }).map(function(item) {
            return path.join(bowerDir, item);
        }).each(function(value) {
            var bowerJson = grunt.file.readJSON(path.join(value, '.bower.json'));
            var pkg = {
                "srcDir": value,
                "tarDir": path.join(targetDir, bowerJson.name + '@' + bowerJson.version),
                "files": []
            };
            grunt.file.recurse(value, function callback(abspath, rootdir, subdir, filename) {
                pkg.files.push(path.join(subdir || '', filename));
                tally.files++;
            });
            packages.push(pkg);
            tally.pkgs++;
        });

        _(packages).each(function(pkg) {
            _(pkg.files).each(function(file) {
                grunt.file.copy(path.join(pkg.srcDir, file), path.join(pkg.tarDir, file));
            });
        });

        log('Copied ' + chalk.cyan(tally.pkgs.toString()) + (tally.pkgs === 1 ? ' package' : ' packages') + ', and ' +
            chalk.cyan(tally.files.toString()) + (tally.files === 1 ? ' file' : ' files.'));

        callback();
    }

    grunt.registerMultiTask('mbower', 'Install and distribute Bower packages.', function() {

        var tasks = [],
            done = this.async(),
            options = this.options({
                cleanTargetDir: true,
                cleanBowerDir: false,
                copy: true,
                install: true,
                targetDir: './wwwroot/',
                verbose: false
            }),

            add = function(successMessage, fn) {
                tasks.push(function(callback) {
                    fn(function() {
                        grunt.log.ok(successMessage);
                        callback();
                    });
                });
            },
            bowerDir = options.bowerDir = path.resolve(bower.config.directory),
            targetDir = options.targetDir = path.resolve(options.targetDir, ".\\moe_packages");

        if (options.cleanTargetDir) {
            add('Cleaned target dir ' + chalk.grey(targetDir), function(callback) {
                clean(targetDir, callback);
            });
        }

        if (options.install) {
            add('Installed bower packages', function(callback) {
                install(options, callback);
            });
        }

        if (options.copy) {
            add('Copied packages to ' + targetDir.grey, function(callback) {
                copy(options, callback);
            });
        }

        if (options.cleanBowerDir) {
            add('Cleaned bower dir ' + bowerDir.grey, function(callback) {
                clean(bowerDir, callback);
            });
        }

        async.series(tasks, done);
        log('\n');
    });
};
