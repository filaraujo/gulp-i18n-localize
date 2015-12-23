# gulp-i18n-localize [![Build Status](https://travis-ci.org/filaraujo/gulp-i18n-localize.svg?branch=master)](https://travis-ci.org/filaraujo/gulp-i18n-localize)

> My exquisite gulp plugin


## Install

```
$ npm install --save-dev gulp-i18n-localize
```


## Usage

```js
var gulp = require('gulp');
var i18n2 = require('gulp-i18n-localize');

gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(i18n2())
		.pipe(gulp.dest('dist'));
});
```


## API

### i18n2(options)

#### options

##### foo

Type: `boolean`
Default: `false`

Lorem ipsum.


## License

MIT © [Filipe Araujo](https://github.com/filaraujo)
