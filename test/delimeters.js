'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var i18n2 = require('.././');

describe('gulp-i18n2: delimiters', function() {
	var stream;

	it('uses default "${{ }}$" delimeter when not defined', function(cb) {
		stream = i18n2({
			locales: ['en-US'],
			localeDir: './test/fixtures/locales'
		});

		stream.on('data', function (file) {
			assert.strictEqual(file.contents.toString(), 'bar');
		});

		stream.on('end', cb);
		stream.write(new gutil.File({
			base: __dirname,
			path: __dirname + '/file.html',
			contents: new Buffer('${{ foo.bar }}$')
		}));
		stream.end();
	});

	it('uses custom delimeters if defined', function(cb) {
		stream = i18n2({
			locales: ['en-US'],
			delimeters: ['#{', '}#'],
			localeDir: './test/fixtures/locales'
		});

		stream.on('data', function (file) {
			assert.strictEqual(file.contents.toString(), 'bar');
		});

		stream.on('end', cb);
		stream.write(new gutil.File({
			base: __dirname,
			path: __dirname + '/file.html',
			contents: new Buffer('#{ foo.bar }#')
		}));
		stream.end();
	});
});
