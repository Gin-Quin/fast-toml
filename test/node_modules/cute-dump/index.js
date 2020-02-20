'use strict';

/**
* Wrapper around chalk to display colors on the browser or the console.
*/

// not in node-like envirnoment
if (typeof require == 'undefined') {
	var chalk = new Proxy({}, {
		get() { return i => i }  // identity function
	});
}
else var chalk = require('chalk');


const span = (color, str) => `<span class="cute-dump-${color}">${str}</span>`;

let mode = 'console';

const colors = {
	set mode(val) { mode = val; },

	function (str) { return colors[mode].function(str) },
	date     (str) { return colors[mode].date(str) },
	keyword  (str) { return colors[mode].keyword(str) },
	string   (str) { return colors[mode].string(str) },
	number   (str) { return colors[mode].number(str) },
	property (str) { return colors[mode].property(str) },

	console: {
		function: chalk.red,
		date: chalk.green,
		keyword: chalk.blue,
		string: chalk.yellow,
		number: chalk.magenta,
		property: chalk.white,
	},

	html: {
		function: span.bind(null, 'function'),
		date: span.bind(null, 'date'),
		keyword: span.bind(null, 'keyword'),
		string: span.bind(null, 'string'),
		number: span.bind(null, 'number'),
		property: span.bind(null, 'property'),
	},
};

const indent = 3;  // number of spaces

const sizeof = val => {
	if (!val) return 0
	if (typeof val != 'object') return 0
	if (Array.isArray(val)) return val.length
	return Object.keys(val).length
};

function sortKeys(a, b) {  // needs to be binded to an object
	return sizeof(this[a]) - sizeof(this[b])
}

function forEachOf(container, callback) {
	if (!container) return
	if (Array.isArray(container)) {
		for (const element of container)
			callback(colors.property('-' + ' '.repeat(indent-1)), element, true);
	}
	else {
		const keys = Object.keys(container).sort(sortKeys.bind(container));
		for (const key of keys)
			callback(colors.property(key) + ': ', container[key], false);
	}
}

function print(mode, data, depth=0) {
	colors.mode = mode;
	let result = '';
	let line = (msg, isObject) => ' '.repeat(indent * depth) + msg + (isObject ? '' : '\n');

	forEachOf(data, (intro, value, inArray) => {
		let isObject = false;

		switch (typeof value) {
			case 'string':
				intro += colors.string('"'+value+'"');
			break

			case 'number':
				intro += colors.number(value);
			break

			case 'boolean':
			case 'undefined':
				intro += colors.keyword(value);
			break

			case 'function':
				let content = value.toString();
				if (content.includes('\n'))
					content = '[Function]';
				else if (content.length > 32)
					content = content.slice(0, 32) + '...';
				intro += colors.function(content);
			break

			case 'object':
				if (value instanceof Date)
					intro += colors.date(value.toLocaleString());
				else if (!value)
					intro += colors.keyword('null');
				else {
					isObject = true;
					let subContent = print(mode, value, depth+1);
					if (inArray)
						intro += subContent.trimLeft();
					else
						intro += '\n' + subContent;
				}
			break

			default: intro += value;
		}
		result += line(intro, isObject);
	});

	return result
}

const cute = {
	dump:  msg => console.log   (print('console', msg)),
	log:   msg => console.log   (print('console', msg)),
	warn:  msg => console.warn  (print('console', msg)),
	error: msg => console.error (print('console', msg)),
	html:  msg => print('html', msg),
};

module.exports = cute;
