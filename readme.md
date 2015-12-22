# gulp-i18n2 [![Build Status](https://travis-ci.org/filaraujo/gulp-i18n2.svg?branch=master)](https://travis-ci.org/filaraujo/gulp-i18n2)

> My exquisite gulp plugin


## Install

```
$ npm install --save-dev gulp-i18n2
```


## Usage

```js
var gulp = require('gulp');
var i18n2 = require('gulp-i18n2');

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
