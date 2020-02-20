const { parseFile } = require('../dist/node')
const { resolve } = require('path')
const { stage, starTest, test } = require('fartest')
const { dump } = require('cute-dump')
const fs = require('fs')

const filePath = file => resolve(__dirname, file)

/** Compare two objects and throw if different */
function compare(from, to, keys=[]) {
	if (typeof from != typeof to)
		throw `Bad type for '${keys.join('.')}' : expecting '${typeof from}' but received '${typeof to}'`

	else if (from instanceof Array) {
		if (from.length != to.length)
			throw `Bad length for array '${keys.join('.')}' : expecting '${from.length}' but received '${to.length}'`

		for (let i=0; i < from.length; i++)
			compare(from[i], to[i], keys.concat(`[${i}]`))
	}

	else if (typeof from == 'object') {
		for (let key in from)
			compare(from[key], to[key], keys.concat(key))
	}

	else if (from != to)
		throw `Bad value for '${keys.join('.')}': expecting '${from}' but received '${to}'`
}



starTest(async function() {


	stage('Sample A')
	const A = await parseFile(filePath('sampleA.toml'))
	const jsonA = JSON.parse(fs.readFileSync(filePath('sampleA.json')))
	test(A.owner.name == 'Tom Preston-Werner', 'Owner is Tom')
	test(A.dog["tater.man"].type == "pug", "We do have a pug")
	test(A["table-1"].key2 == 123, "Colon in name is ok")

	try { compare(jsonA, A) }
	catch (error) { test(false, error) }

	stage('Sample B')
	const B = await parseFile(filePath('sampleB.toml'))
	test(B.servers.beta.country == '中国')

	stage('Sample C')
	const C = await parseFile(filePath('sampleC.toml'))

	stage('Sample D')
	const D = await parseFile(filePath('sampleD.toml'))
	test(D.zabu == "I'm truly in love with you")
})
