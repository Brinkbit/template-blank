'use strict';

module.exports = function initGrunt( grunt ) {
    [
        'grunt-contrib-clean',
        'grunt-contrib-copy'
    ]
    .forEach( grunt.loadNpmTasks );

    require( 'load-grunt-tasks' )( grunt );

    grunt.initConfig({

        pkg: grunt.file.readJSON( 'package.json' ),

        clean: {
            build: 'build'
        },

        eslint: {
            target: [ 'src/**/*.js', 'test/**/*.js', 'Gruntfile.js' ]
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [ '**' ],
                        dest: 'build/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/phaser/build/',
                        src: [ 'phaser.map', 'phaser.min.js' ],
                        dest: 'build/'
                    },
                    {
                        src: 'node_modules/store/store.min.js',
                        dest: 'build/store.min.js'
                    }
                ]
            }
        }

    });

    grunt.registerTask( 'build', [
        'clean',
        'copy'
    ]);
};
