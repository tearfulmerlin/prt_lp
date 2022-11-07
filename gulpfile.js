const { src, dest, parallel } = require('gulp');
const webp = require('gulp-webp');
const replace = require("gulp-replace");

const BUILD_DIR = '.build';

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
		.pipe(dest(d));
}
function copy(s, d) {
	return src(s.path, s.options)
		.pipe(dest(d));
}

// exports.default = replaceImagePaths
exports.default = parallel(
	() => replaceImagePaths({ path: ['public/index.html'] }, BUILD_DIR),
	() => replaceImagePaths({path: 'public/assets/styles/*', options: { base: './public' } }, BUILD_DIR),
	() => copy({ path: ['prt-server.js', 'package.json', 'package-lock.json'], options: { base: '.' } }, BUILD_DIR),
	() => convertToWebP({ path: ['public/assets/images/*.png', 'public/assets/images/*.jpg'] }, `${BUILD_DIR}/assets/images/`),
	() => copy({ path: ['public/assets/**/*', '!public/assets/images/*', '!public/assets/styles/*'], options: { base : './public' } }, BUILD_DIR)
)
