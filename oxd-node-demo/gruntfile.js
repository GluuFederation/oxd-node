module.exports = function(grunt) {
    grunt.initConfig({
        nodemon: {
            all: {
                script: 'index.js',
                options: {
                    watchedExtensions: ['js']
                }
            }
        },
    });
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('default', ['nodemon'])
};
