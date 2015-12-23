'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var i18n = require('.././');


describe('gulp-i18n-localize: locale', function() {
  var file = new gutil.File({
    base: __dirname,
    path: __dirname + '/file.html',
    contents: new Buffer('${{ foo.bar }}$')
  });
  var stream;

  it('uses locale directory when not defined', function(cb) {
    var output = [];

    stream = i18n({
      localeDir: './test/fixtures/locales'
    });

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
    stream = i18n({
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
