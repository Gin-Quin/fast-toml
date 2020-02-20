/*-------------------------------------
       FAst and smaRT TESTing
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Very small handmade library for
	easy and fast testing.
--------------------------------------*/

const chalk = require('chalk')

if (!chalk)
	throw '`npm install` is necessary'


let
	currentStage = '',
	fails = [],
	totalErrors = 0,
	stageError = false,
	runningTest = false,
	testQueue = []


function happy() {
	const emojis = ['😏', '😄', '😃', '😉', '😊', '😋', '😌']
	return emojis[Math.floor(Math.random() * emojis.length)]
}

function sad() {
	const emojis = ['😓', '😢', '😞', '😩', '😫']
	return emojis[Math.floor(Math.random() * emojis.length)]
}

async function start(testFunction) {
	if (runningTest)
		return testQueue.push(testFunction)
	runningTest = true

	let {name} = testFunction
	if (name) {
		console.log(chalk.bold.blue("🢚 "+name))
		name += ' '
	}

	try {
		await testFunction()
		endStage()

		if (totalErrors == 1)
			console.log(chalk.bold.yellow(`One error occured during the test ${name}${sad()}\n`))
		else if (totalErrors > 1)
			console.log(chalk.bold.yellow(`${fails.length} errors occured during the test ${name}${sad()}\n`))
		else
			console.log(chalk.bold.green(`The test ${name}has been successfully passed ${happy()}\n`))
	}
	catch (error) {
		console.log(chalk.bold.red(`✗ ${currentStage} : a critical error occured ${sad()} :`))
		if (typeof error == 'object' && error instanceof Error) {
			console.log(error.message)
			if (error.code)
				console.log("Code error "+ error.code)
			if (error.stdout)
				console.log(error.stdout)
			if (error.stderr)
				console.log(error.stderr)
		}
		else
			console.log(error)
		console.log()
	}

	// next test function
	const next = testQueue.shift()
	currentStage = ''
	totalErrors = 0
	stageError = false
	runningTest = false

	if (next)
		start(next)
}

function stage(newStage) {
	endStage()
	currentStage = newStage
}

function endStage() {
	if (!currentStage)
		return
	if (fails.length) {
		console.log(chalk.bold.red("✗ "+currentStage))
		for (const fail of fails)
			console.log(chalk.gray.italic("  Error at : " + chalk.reset.bold.italic.red(fail)))
		fails.length = 0
		totalErrors++
	}
	else
		console.log(chalk.green("✓ "+currentStage))
}

function test(conditionA, testDescription='') {
	if (conditionA) return
	fails.push(testDescription)
}


module.exports = {
	start,
	starTest: start,  // for retro-compatibility
	stage,
	test,
}