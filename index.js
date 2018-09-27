'use strict';
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var requireDir = require('require-dir');
var through = require('through2');
var istextorbinary = require('istextorbinary');

var escapeChars = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
var localizationMatchCount;

/**
 * @param {string} type schema type
 * @param {string} filePath file path
 * @return {array} schema collection
 */
function getSchema(type, file) {
  var dir = path.resolve(file.cwd, file.base);
  var regexSeperator = new RegExp('^\\' + path.sep);
  var base = file.path.replace(dir, '').replace(regexSeperator, '');
  var parsed = path.parse(base);

  var schemas = {
    directory: ['LOCALE', parsed.dir, parsed.base],
    suffix: [parsed.dir, parsed.name + '-LOCALE' + parsed.ext]
  };

  return schemas[type] || schemas.directory;
}

/**
 * @param {string} content data to translate
 * @param {obj} options configuration object
 * @return {obj} collection object with translations
 */
function i18n(file, options, errors) {
  var i18ns = {};
  var isBinary = istextorbinary.isBinarySync(file.path, file.contents);
  var stringContents = file.contents.toString();

  options.locales.forEach(function(locale) {
    var dict = options.dictionary[locale];
    i18ns[locale] = null;

    if (!isBinary) {
      i18ns[locale] = stringContents
        .replace(options.regex, function($0, $1) {
          var match = lookup(dict, $1);
          var notFound = match === undefined;

          if (notFound) {
            errors.push([$0, 'translation missing in', locale]);
          } else {
            localizationMatchCount++;
          }

          return notFound ? $0 : match;
        });
    }
  });

  return i18ns;
}

/**
 * @param {obj} dict dictionary object
 * @return {string} translated text
 */
function lookup(dict, $1) {
  var key = $1.split('.');

  var value = key.reduce(function(c, a) {
    return (c || {})[a];
  }, dict);

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

module.exports = function(options) {
  localizationMatchCount = 0;

  if (!options || !options.localeDir) {
    throw new gutil.PluginError('gulp-i18n-localize', 'locale directory required');
  }

  var localeDir = path.resolve(process.cwd(), options.localeDir);

  try {
    fs.accessSync(localeDir);
    options.dictionary = requireDir(localeDir, {recurse: true, noCache: true});
  } catch (e) {
    gutil.log('gulp-i18n-localize: locale directory not found');
    options.dictionary = false;
  }

  options.locales = options.locales || Object.keys(options.dictionary);
  options.ignoreErrors = options.ignoreErrors || false;
  options.schema = options.schema || 'directory';
  options.regex = setRegex(options.delimeters || ['${{', '}}$']);

  return through.obj(function(file, enc, cb) {
    var filePath;
    var output;
    var schema;
    var errors = [];

    if (file.isNull() || !options.dictionary) {
      cb(null);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-i18n-localize', 'Streaming not supported'));
      return;
    }

    try {
      output = i18n(file, options, errors);
      schema = getSchema(options.schema, file);

      errors.forEach(function(error) {
        gutil.log.apply({}, ['gulp-i18n-localize:'].concat(error));

        if (!options.ignoreErrors) {
          new gutil.PluginError('gulp-i18n-localize', error);
        }
      });

      Object.keys(output)
        .forEach(function(locale) {
          var contents = file.contents;

          filePath = path.resolve.apply(path, schema)
            .replace('LOCALE', locale);

          // if localization convert to buffer
          if (output[locale]) {
            contents = new Buffer(output[locale]);
          }

          this.push(new gutil.File({
            path: filePath,
            contents: contents
          }));
        }, this);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-i18n-localize', err));
    }

    cb();
  }, function(cb) {
    gutil.log.apply({}, ['gulp-i18n-localize:', localizationMatchCount, 'translations found']);
    cb();
  });
};
