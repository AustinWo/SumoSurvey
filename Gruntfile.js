module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['Gruntfile.js', 'server/**/*.js','client/app/**/*.js']
    }
  });

  grunt.registerTask('test', [
    'jshint'
    ]);

  grunt.registerTask('default', 'test');

};
