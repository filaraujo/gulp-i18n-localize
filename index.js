'use strict';
var gutil = require('gulp-util');
var path = require('path');
var requireDir = require('require-dir');
var through = require('through2');

var escapeChars = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

/**
 * @param {string} type schema type
 * @param {string} filePath file path
 * @return {array} schema collection
 */
function getSchema(type, filePath) {
  var parsed = path.parse(filePath);

  var schemas = {
    directory: [parsed.dir, 'LOCALE', parsed.base],
    suffix: [parsed.dir, parsed.name + '-LOCALE' + parsed.ext]
  };

  return schemas[type] || schemas.directory;
}

/**
 * @param {string} content data to translate
 * @param {obj} options configuration object
 * @return {obj} collection object with translations
 */
function i18n(content, options, errors) {
  var i18ns = {};

  options.locales.forEach(function(locale) {
    var dict = options.dictionary[locale];

    i18ns[locale] = content.replace(options.regex, function($0, $1) {
      var match = lookup(dict, $1);

      if (!match) {
        errors.push([$0, 'translation missing in', locale]);
      }

      return match || $0;
    });
  });

  return i18ns;
}

/**
 * @param {obj} dict dictionary object
 * @return {string} translated text
 */
function lookup(dict, $1) {
  var key = $1.split('.');
  key.unshift(dict);

  var value = key.reduce(function(c, a, b) {
    return c[a] || '';
  });

  return value;
}

/**
 * @param {array} delimeters to use
 * @return {regex} regex matcher
 */
function setRegex(delimeters) {
  var dilems = delimeters.map(function(dilem) {
    return dilem.replace(escapeChars, '\\$&');
  });
  dilems.splice(1, 0, ' ?([\\w-.]+) ?');
  return new RegExp(dilems.join(''), 'g');
}

module.exports = function (options) {
  if (!options || !options.localeDir) {
    throw new gutil.PluginError('gulp-i18n-localize', '`locale directory` required');
  }

  var localeDir = path.resolve(process.cwd(), options.localeDir);

  options.dictionary = requireDir(localeDir, {recurse: true});
  options.locales = options.locales || Object.keys(options.dictionary);
  options.ignoreErrors = options.ignoreErrors || false;
  options.schema = options.schema || 'directory';
  options.regex = setRegex(options.delimeters || ['${{', '}}$']);

  return through.obj(function (file, enc, cb) {
    var filePath;
    var output;
    var schema;
    var errors = [];

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-i18n-localize', 'Streaming not supported'));
      return;
    }

    try {
      output = i18n(file.contents.toString(), options, errors);
      schema = getSchema(options.schema, file.path);

      errors.forEach(function(error) {
        gutil.log.apply({}, error);

        if (!options.ignoreErrors) {
          new gutil.PluginError('gulp-i18n-localize', error);
        }
      });

      Object.keys(output)
        .forEach(function(locale) {
          filePath = path.resolve.apply(path, schema)
            .replace('LOCALE', locale);

          this.push(new gutil.File({
            path: filePath,
            contents: new Buffer(output[locale])
          }));
        }, this);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-i18n-localize', err));
    }

    cb();
  });
};
