const { src, dest, parallel } = require('gulp');
const webp = require('gulp-webp');
const replace = require("gulp-replace");
const minify = require("gulp-babel-minify");
const htmlmin = require("gulp-htmlmin");

const BUILD_DIR = '.build';
const BUILD_HTML = '.build/html';

function convertToWebP(s, d) {
	return src(s.path, s.options)
		.pipe(webp({
			quality: 75,
			metadata: 'none',
		}))
		.pipe(dest(d))
}

function replaceImagePaths(s, d) {
	return src(s.path, s.options)
		.pipe(replace('.png', '.webp'))
		.pipe(replace('.jpg', '.webp'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
		.pipe(dest(d));
}
function copy(s, d) {
	return src(s.path, s.options)
		.pipe(dest(d));
  }
  function compileScripts(s, d) {
    return src(s.path, s.options)
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(dest(d));
}

exports.default = parallel(
	() => replaceImagePaths({ path: ['public/*.html'] }, BUILD_HTML),
	() => replaceImagePaths({path: 'public/assets/styles/*', options: { base: './public' } }, BUILD_HTML),
	() => convertToWebP({ path: ['public/assets/images/*.png', 'public/assets/images/*.jpg'] }, `${BUILD_HTML}/assets/images/`),
	() => copy({ path: ['public/assets/**/*', '!public/assets/scripts/*', '!public/assets/images/*.jpg', '!public/assets/images/*.png', '!public/assets/styles/*', 'public/robots.txt'], options: { base : './public' } }, BUILD_HTML),
	() => compileScripts({ path: ['public/assets/scripts/*'], options: { base : './public' } }, BUILD_HTML),
)
