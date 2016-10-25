module.exports = function (grunt) {

    require('time-grunt')(grunt);

    // load all grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({

        // Watches content related changes
        watch : {
            sass : {
                files: ['sass/**/*.scss'],
                tasks: ['sass','postcss']
            }
        },
        // Sass compilation. Produce an extended css file in css folder
        sass : {
            options: {
                sourcemap:'none', 
                style: 'expanded'
            },
            dist : {
                files: {
                    'main.css': 'sass/main.scss'
                }
            }
        },
        // Auto prefixer css
        postcss : {
            dist: {
                options: {
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}),
                        require('cssnano')()
                    ]
                },
                src: 'main.css'
            }
        },
        //Server creation
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        },
        // Open default browser
        open: {
            local: {
                path: 'http://localhost:3000/index.html'
            }
        }
    });

    grunt.registerTask('default', 'Compile and watch source files', [
        'dev',
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('run', 'Run the webserver and watch files', [
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('dev', 'build dev version', [
        'sass',
        'postcss'
    ]);

    grunt.registerTask('test', 'test dist version', [
        'open',
        'connect:test'
    ]);

};


