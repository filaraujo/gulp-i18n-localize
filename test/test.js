'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var i18n2 = require('.././');


describe('gulp-i18n2', function() {
	var file;
	var stream;

	beforeEach(function() {
		stream = i18n2({
			localeDir: './test/fixtures/locales'
		});
	});

	it('throws an error when no "localeDir" is defined', function() {
		assert.throws(function() {
			i18n2();
		});
	});

	describe('.locales', function() {
		beforeEach(function() {
			file = new gutil.File({
				base: __dirname,
				path: __dirname + '/file.html',
				contents: new Buffer('${{ foo.bar }}$')
			});
		});

		it('uses locale directory when not defined', function(cb) {
			var output = [];

			stream.on('data', function (file) {
				output.push(file.contents.toString());
			});

			stream.on('end', function() {
				assert.deepEqual(output, ['bar', 'baz']);
				cb();
			});

			stream.write(file);
			stream.end();
		});

		it('uses locale when defined', function(cb) {
			stream = i18n2({
				locales: ['es-US'],
				localeDir: './test/fixtures/locales'
			});

			stream.on('data', function (file) {
				assert.strictEqual(file.contents.toString(), 'baz');
			});

			stream.on('end', cb);
			stream.write(file);
			stream.end();
		});
	});

	describe('when given valid markup containing correct syntax', function() {
		it('localizes the content', function (cb) {
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
	});

	describe('when given valid syntax', function() {
		it('localizes the content', function (cb) {
			stream.on('data', function (file) {
				assert.strictEqual(file.contents.toString(), '$ foo.bar $');
			});

			stream.on('end', cb);
			stream.write(new gutil.File({
				base: __dirname,
				path: __dirname + '/file.html',
				contents: new Buffer('$ foo.bar $')
			}));
			stream.end();
		});
	});
});
