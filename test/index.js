'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var i18n2 = require('.././');

describe('gulp-i18n2', function() {
  var stream;

  beforeEach(function() {
    stream = i18n2({
      locales: ['en-US'],
      localeDir: './test/fixtures/locales'
    });
  });

  it('throws an error when no "localeDir" is defined', function() {
    assert.throws(function() {
      i18n2();
    });
  });

  describe('when given valid markup containing correct syntax', function() {
    it('localizes the content', function (cb) {
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
