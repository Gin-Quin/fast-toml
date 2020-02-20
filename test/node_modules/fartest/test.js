
const { start, stage, test } = require('./index')

start(function() {
	stage("ZABU")
	test(1 == 1, 'check raw equality')
	test(1 == 2, 'Check raw equality')
	test(1 == 2, 'Second check')
	test(1 == 2, 'Will this work now?')
	test(1 == 1, 'this one works')

	stage("COCO")
	test(1 == 1, 'True')
	test(1 == 1, 'False')
})