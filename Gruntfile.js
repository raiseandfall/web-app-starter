module.exports = function(grunt) {

  grunt.initConfig({
    // load our main definition package
    pkg: grunt.file.readJSON('package.json'),

    assemble: {
      options: {
        pkg: '<%= pkg %>',
        data: ['src/data/**/*.{json,yml}', 'package.json'],
        flatten: true,
        layout: 'layout.hbs',
        layoutdir: 'src/templates/docs/layouts',
        assets: 'docs/assets',
        partials: ['src/templates/docs/pages/*.hbs', 'src/templates/docs/partials/*.hbs']
      },
      docs: {
        options: {
          data: ['src/data/*.{json,yml}']
        },
        files: {
          'docs/': ['src/templates/docs/pages/*.hbs']
        }
      }
    },

    autoprefixer: {
      build: {
        options: {
          browsers: ['last 2 versions', '> 1%']
        },
        files: [
          {
            src : ['**/*.css', '!**/*autoprefixed.css'],
            cwd : 'css',
            dest : 'css',
            ext : '.autoprefixed.css',
            expand : true
          }
        ]
      }
    },

    compress: {
      source: {
        options: {
          archive: 'docs/exports/compress-v<%= pkg.version %>.zip',
          pretty: true,
          mode: 'tgz'
        },
        files: [
          {
            expand: true,
            cwd: 'docs/assets/',
            src: ['js/*.js', 'css/style.css', 'css/fonts/*.*'],
            dest: 'compress-v<%= pkg.version %>'
          }
        ]
      }
    },

    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*!\n<%= pkg.name %>\nv<%= pkg.version %>\n<%= grunt.template.today("mm-dd-yyyy") %>\nMade by <%= pkg.author.name %> - <%= pkg.author.url %>\n*/'
      },
      js: {
        src: ['js/*.js'],
        dest: 'docs/assets/js/script.js'
      },
      css: {
        src: ['icon/style.css', 'css/style.autoprefixed.css'],
        dest: 'docs/assets/css/style.css'
      }
    },

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8000,
          base: 'docs/'
        }
      }
    },

    copy: {
      fonts: {
        files: [
          { expand: true, cwd: './icon/fonts', src: ['./**/*.*'], dest: 'docs/assets/css/fonts' }
        ]
      },
      js: {
        files: [
          { expand: true, cwd: './js', src: ['./*.js'], dest: 'docs/assets/js' }
        ]
      },
      vendors: {
        files: [
          { expand: true, cwd: './vendors', src: ['./**/*.*'], dest: 'docs/vendors' }
        ]
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'docs/assets/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'docs/assets/css/',
        ext: '.min.css'
      }
    },

    sass: {
      build: {
        files : [
          {
            src : ['style.scss'],
            cwd : 'scss',
            dest : 'css',
            ext : '.css',
            expand : true
          }
        ],
        options : {
          style : 'expanded'
        }
      },
      docs: {
        files : [
          {
            src : ['docs.scss', 'docs_*.scss', 'examples.scss'],
            cwd : 'scss',
            dest : 'docs/assets/css/',
            ext : '.css',
            expand : true
          }
        ],
        options : {
          style : 'expanded'
        }
      }
    },

    uglify: {
      options: {
        report: true
      },
      js: {
        files: {
          'docs/assets/js/script.min.js': ['docs/assets/js/script.js']
        }
      }
    },

    jshint: {
      all: [
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      scss: {
        files: ['scss/**/*.scss'],
        tasks: 'scss'
      },
      html: {
        files: ['src/**/*.hbs'],
        tasks: 'html'
      },
      js: {
        files: ['js/*.js'],
        tasks: 'js'
      },
      vendors: {
        files: ['vendors/docs/*.js'],
        tasks: 'vendors'
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'docs/**/*.html',
          'docs/assets/css/{,*/}*.css',
          'docs/assets/js/{,*/}*.js',
          'docs/vendors/docs/{,*/}*.js'
        ]
      }
    }

  });

  grunt.registerTask('scss', ['sass', 'autoprefixer', 'concat:css', 'cssmin:minify', 'sass:docs']);
  grunt.registerTask('html', ['assemble:docs']);
  grunt.registerTask('js', ['copy:js', 'copy:vendors', 'concat:js', 'uglify:js', 'compress']);
  grunt.registerTask('vendors', ['copy:vendors']);

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', [
    'sass',
    'autoprefixer',
    'concat:css',
    'assemble:docs',
    'copy',
    'cssmin:minify',
    'sass:docs',
    'concat:js',
    'uglify:js',
    'compress'
  ]);
  grunt.registerTask('dev', ['connect:server', 'watch']);

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  require('matchdep').filterDev('grunt-contrib*').forEach(grunt.loadNpmTasks);
};
