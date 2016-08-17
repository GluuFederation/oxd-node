module.exports = function(grunt) {
    grunt.initConfig({
        nodemon: {
            all: {
                script: 'index.js',
                options: {
                    watchedExtensions: ['js'],
                    ignore: ['json'],
                }
            }
        },
    });
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('default', ['nodemon'])
};
