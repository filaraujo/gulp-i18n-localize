# gulp-i18n-localize [![Build Status](https://travis-ci.org/filaraujo/gulp-i18n-localize.svg?branch=master)](https://travis-ci.org/filaraujo/gulp-i18n-localize)

> localization plugin for gulp


## Install

```
$ npm install --save-dev gulp-i18n-localize
```


## Usage

```js
var gulp = require('gulp');
var i18n = require('gulp-i18n-localize');

gulp.task('default', function () {
	return gulp.src('src/index.html')
		.pipe(i18n({
			locales: ['en-US'],
			localeDir: './locales'
		}))
		.pipe(gulp.dest('dist'));
});
```

## File structure
Create a localization folder `locales` for example that contains language subfolders.
Translations are referenced against the folder name and key value in the file.

For example if you wanted to add spanish translations for animals you would
create a `.locales/es-US` directory containing a `animals.json` file.
The file would contain the translations below.
```json
{
	"cat": "gato",
	"dog": {
		"name": "perro"
	}
}
```

You then could reference this by using `${{ animals.cat }}$` and
`${{ animals.dog.name }}$` in your code.



## API

### i18n(options)

#### options

##### delimeters

Type: `array`
Default: `['${{', '}}$']`

Sets the delimeters to search assets files and replace with translated content.
By default, it will match `${{` and `$}}`.

delimeter[0] 	| delimeter[1]	| matches
---						| --- 					| ---
`${{` 				| `}}$`					| `${{ foo.bar }}$`
`!{` 					|	`}!`					| `!{ foo.bar }!`
`#{` 					|	`}#`					| `#{ foo.bar }#`


---

##### ignoreErrors

Type: `boolean`

Sets whether to ignore errors and prevent gulp from failing. This will still log
errors to gulp.

---

##### localeDir

Type: `array`
`Required`

Location of translation files. This is a required field.

---

##### locales

Type: `array`
Default: `['en-US']`

Locales to translate, should match `localDir` subfolders.

---

##### schema

Type: `string`
Default: `directory`

Sets the schema to be used for naming translated assets.

schema			| output name
----------- | -------------
`directory`	| `/en-US/index.html`
`suffix`  	| `/index-en-US.html`



## License

MIT © [Filipe Araujo](https://github.com/filaraujo)
