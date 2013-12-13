var htmlFilesForRelease = {
       'prod/index.html': 'prod/index.html'
    },
    jsFiles = {
       'dev/js/main.js':"dev/dev_js/*&main.js"
    },
    jsFilesForRelease = {
      'prod/js/script.min.js': ['dev/js/main.js']
    },
    LIVERELOAD_PORT = 1337,
    lrSnippet = require('connect-livereload')({port:LIVERELOAD_PORT}),
    mountFolder = function(connect, dir){
      return connect.static(require("path").resolve(dir));
    }

module.exports = function(grunt) {
  grunt.initConfig({
    stylus: {
      compile: {
        files: {
          "dev/css/styles.css" : ["dev/stylus/normalize.styl","dev/stylus/*.styl" ]
        },
        options: {
          compress:false
        }
      }
    },
    connect: {
      options: {
        port: 9000
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'dev'),
              mountFolder(connect, '.tmp')
            ];
          }
        }
      }
    },
    includereplace: {
      build: {
        options: {
          prefix: '@@',
          suffix: '',
          cwd: true,
          globals: {
            script_path: "js/main.js",
            styles_path: "css/styles.css"
          },
        },
        src: "dev/pages/*.html",
        dest: 'dev/',
      },
      release: {
         options: {
          prefix: '@@',
          suffix: '',
          cwd: true,
          globals: {
            script_path: "js/main.min.js",
            styles_path: "css/styles.min.css",
          },
        },
        src: "dev/pages/*.html",
        dest: 'prod/'
      }
    },
    htmlmin: {                                     
       dist: {                                      
         options: {                               
           removeComments: true,
           collapseWhitespace: true
         },
         files:htmlFilesForRelease
       }
    },
    clean: {
      release: {
        src: ["prod/"]
      }
    },
    watch: {
      livereload:{
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          "dev/css/*.css",
          "dev/img/**",
          "dev/temp/**",
          "dev/js/*.js"
        ]
      },
      stylus: {
        files: ["dev/stylus/*.styl" ],
        tasks: ['stylus'],
        options: {
          spawn: false
        }
      },
      jsconcat:{
        files: ["dev/dev_js/*.js" ],
        tasks: ['concat:js'],
        options: {
          spawn: false
        }
      },
      html: {
        files: ["dev/html_blocks/*.html","dev/pages/*.html"],
        tasks: ['includereplace:build'],
        options: {
          spawn: false
        }
      }
    },
    cssmin: {
      minify: {
       expand: true,
       cwd: 'dev/css/',
       src: ['*.css'],
       dest: 'prod/css/',
       ext: '.min.css'
     }
    },
    uglify: {
      js_main: {
        files: jsFilesForRelease
      }
    },
    concat: {
      js:{
         files: jsFiles
      }
    },
    copy: {
      images: {
         expand: true,
         cwd: "dev/img/",
         src: ["**"],
         dest: 'prod/img/'
      },
      tempimages: {
         expand: true,
         cwd: "dev/temp/",
         src: ["**"],
         dest: 'prod/temp/'
      },
      scriptLibs: {
         expand: true,
         cwd: "dev/js/libs/",
         src: ["**"],
         dest: "prod/js/libs/"
      }
    }
  });

  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['stylus',"includereplace:build","concat"]);
  grunt.registerTask('release', ["clean:release","includereplace:release","cssmin", "uglify"/*,"htmlmin"*/,"copy"]);
  grunt.registerTask('default', ['connect','watch']);
};