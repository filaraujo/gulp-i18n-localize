'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var requireDir = require('require-dir');
var regexMatch = /\${{ ?([\w\-\.]+) ?}}\$/g;

function i18n(content, options) {
	var i18ns = {};

	options.locales.forEach(function(locale) {
		var dict = options.dictionary[locale];
		i18ns[locale] = content.replace(regexMatch, lookup.bind(null, dict));
	});

	return i18ns;
}

function load(dir) {
	return requireDir(dir, {recurse: true});
}

function lookup(dict, $0, $1) {
	var key = $1.split('.');
	key.unshift(dict);

	var value = key.reduce(function(c, a, b) {
		return c[a];
	});

	return value || $1;
}

module.exports = function (options) {
	if (!options || !options.localeDir) {
		throw new gutil.PluginError('gulp-i18n2', '`locale directory` required');
	}

	options.dictionary = load(options.localeDir);
	options.locales = options.locales || Object.keys(options.dictionary);

	return through.obj(function (file, enc, cb) {
		var output;

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-i18n2', 'Streaming not supported'));
			return;
		}

		try {
			output = i18n(file.contents.toString(), options);

			Object.keys(output)
				.forEach(function(locale) {
					var file = new gutil.File({
						path: __dirname + '/' + locale + '.blah',
						contents: new Buffer(output[locale])
					});

					this.push(file);
				}, this);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-i18n2', err));
		}

		cb();
	});
};
