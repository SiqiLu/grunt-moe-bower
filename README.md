# grunt-moe-bower

> Bower for moe team.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-moe-bower --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-moe-bower');
```

## The "mbower" task

### Overview
In your project's Gruntfile, add a section named `mbower` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  mbower: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

####cleanTargetDir
Type: boolean

Default: ```false```

If this option is set to false, the target directory will not be removed.

####cleanBowerDir
Type: boolean

Default: ```false```

If this option is set to false, the bower directory will not be removed.

####copy
Type: boolean

Default: ```true```

If this option is set to true, the packages will be copied to target direcotory.

####install
Type: boolean

Default: ```true```

If this option is set to true, the bower packages will be installed.
####targetDir
Type: String

Default: ```./wwwroot/```

This sets where the bower packages will be installed.

### Usage Examples

```js
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
```
