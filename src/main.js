'use strict'

import parse from './parser'

let fs = null
let readFile = null

/**
* Use this function to parse javascript template strings :
* let obj = TOML `foo = 12`
*/
function TOML() {
	let result = ''
	for (let arg of arguments)
		result += typeof arg == 'string'? arg : arg[0]
	return parse(result)
}

TOML.parse = parse

TOML.parseFile = async function(file) {
	if (!fs)
		fs = require('fs')
	if (!readFile) {
		const { promisify } = require('util')
		readFile = promisify(fs.readFile)
	}

	const content = await readFile(file)
	return parse(content)
}

TOML.parseFileSync = function(file) {
	if (!fs)
		fs = require('fs')
	return parse(fs.readFileSync(file))
}

export default TOML
