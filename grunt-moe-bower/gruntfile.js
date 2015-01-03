module.exports = function (grunt) {
    
    grunt.initConfig({
        debug: {
            options: {
                open: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('grunt-bower-task');

    var plugin = require('./app.js');
    grunt.registerTask('foo', 'A sample task that logs stuff.', apply(grunt, plugin));

    
};