var htmlFilesForRelease = {
       'prod/index.html': 'prod/index.html'
    },
    jsFiles = {
       'dev/js/main.js':["dev/dev_js/ui&main.js","dev/dev_js/*&main.js"],
       'dev/js/ie.js':["dev/dev_js/*&ie.js"]
    },
    jsFilesForRelease = {
      'prod/js/script.min.js': ['dev/js/main.js'],
      'prod/js/ie.js':["dev/js/ie.js"]
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
          "dev/css/styles.css" : ["dev/stylus/styles.styl"]
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
    open: {
      server: {
        path: "http://localhost:9000"
      }
    },
    includereplace: {
      build: {
        options: {
          prefix: '@@',
          suffix: '',
          globals: {
            script_path: "js/main.js",
            styles_path: "css/styles.css",
            img_path: "img",
            temp_img_path:"temp"
          },
        },
        files: [
          {src: "**/*.html", dest:"dev/", expand: true, cwd: "dev/pages/"}
        ]
      },
      release: {
         options: {
          prefix: '@@',
          suffix: '',
          globals: {
            script_path: "js/main.min.js",
            styles_path: "css/styles.min.css",
            img_path: "img",
            temp_img_path:"temp"
          },
        },
        files: [
          {src: "*.html", dest:"prod/", expand: true, cwd: "dev/pages/"}
        ]
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
      options: {
        livereload: LIVERELOAD_PORT
      },
      stylus: {
        files: ["dev/stylus/*.styl" ],
        tasks: ['stylus',"autoprefixer"],
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
        files: ["dev/html_blocks/**/*.html","dev/pages/**/*.html"],
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
    autoprefixer: {
      options: {
        browsers: ['last 5 version',"> 0.5%"]
      },
      css: {
        expand: true,
        flatten: true,
        src: 'dev/css/*.css',
        dest: 'dev/css/'
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
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['stylus',"autoprefixer","includereplace:build","concat"]);
  grunt.registerTask('release', ["clean:release","includereplace:release","cssmin", "uglify"/*,"htmlmin"*/,"copy"]);
  grunt.registerTask('default', ['connect',"open:server",'watch']);
};