'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var i18n = require('.././');
var sinon = require('sinon');

describe('gulp-i18n-localize', function() {
  var stream;

  beforeEach(function() {
    stream = i18n({
      locales: ['en-US'],
      localeDir: './test/fixtures/locales'
    });
  });

  it('throws an error when no "localeDir" is defined', function() {
    assert.throws(function() {
      i18n();
    });
  });

  describe('when given valid markup containing correct syntax', function() {
    it('localizes the content', function (cb) {
      stream.on('data', function (file) {
        assert.strictEqual(file.contents.toString(), 'bar bar');
      });

      stream.on('end', cb);
      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/file.html',
        contents: new Buffer('${{ foo.bar }}$ ${{ foo.bar }}$')
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

  describe('when given valid markup with missing dictionary matches', function() {
    it('outputs error information', function (cb) {
      var spy = sinon.spy(gutil, 'log');
      stream = i18n({
        ignoreErrors: true,
        locales: ['en-US'],
        localeDir: './test/fixtures/locales'
      });

      stream.on('data', function (file) {
        assert.ok(spy.called);
      });

      stream.on('end', cb);
      stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/file.html',
        contents: new Buffer('${{ bar.foo }}$ ${{ bar.foo }}$')
      }));
      stream.end();
    });
  });

});
