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
