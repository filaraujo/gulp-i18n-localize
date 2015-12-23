'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var i18n = require('.././');


describe('gulp-i18n-localize: schema', function() {
  var file = new gutil.File({
    base: __dirname,
    path: __dirname + '/file.html',
    contents: new Buffer('${{ foo.bar }}$')
  });
  var stream;

  it('uses "directory" schema when not defined', function(cb) {
    stream = i18n({
      locales: ['es-US'],
      localeDir: './test/fixtures/locales'
    });

    stream.on('data', function (file) {
      assert.ok(/\/es-US\/file.html/.test(file.path));
    });

    stream.on('end', cb);
    stream.write(file);
    stream.end();
  });

  it('uses "suffix" schema if defined', function(cb) {
    stream = i18n({
      locales: ['es-US'],
      localeDir: './test/fixtures/locales',
      schema: 'suffix'

    });

    stream.on('data', function (file) {
      assert.ok(/\/file-es-US.html/.test(file.path));
    });

    stream.on('end', cb);
    stream.write(file);
    stream.end();
  });
});
