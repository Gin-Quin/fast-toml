const { parseFile } = require('../package')
const { resolve } = require('path')
const { stage, starTest, test } = require('fartest')

const filePath = file => resolve(__dirname, file)

starTest(async function() {
	stage('Sample A')
	const A = await parseFile(filePath('sampleA.toml'))
	test(A.owner.name == 'Tom Preston-Werner')
	test(A.products[2].sku == 284758393)

	stage('Sample B')
	const B = await parseFile(filePath('sampleB.toml'))
	test(B.servers.beta.country == '中国')

	stage('Sample C')
	const C = await parseFile(filePath('sampleC.toml'))

	stage('Sample D')
	const D = await parseFile(filePath('sampleD.toml'))
	test(D.zabu == "I'm truly in love with you")
})