*FAst and smaRT TESTing*

FarTest is an obvious, colorful and enjoyable test library for small applications.

Your terminal need to accept UTF-8 characters and ANSI colors for a better experience.

# Installation

```
npm install --save-dev fartest
```
In short :
```
npm i -D fartest
```

# Usage
FarTest export three functions :

- *start* - start a new test,
- *stage* - define the current stage inside a test,
- *test* - check an assertion inside a test.

First, let's import the functions we need :
```javascript
const { start, stage, test } = require('fartest')
```
With ES modules :
```javascript
import { start, stage, test } from 'fartest')
```

Then, we start the test :
```javascript
// the name of the function (MyAwesomeTest) is the name of the test
// and is optional
start(async function MyAwesomeTest() {

  // we define the current stage of our test
  stage('Some succesful tests')
    // simple assertion
    test(1 == "1")

    // the test description will be displayed in case of error
    test(21 == "21", "Test description")

  stage('A simple test which will not succeed')
    test(21 === "21", "Test description")  // will fail because types don't match

  stage('Crash test')
    undefined.coco = 321321  // any invalid code will be caught
})
```

## Test asynchronous functions

Declare your main test functions as `async` and just use `await` anywhere an asynchronous function is used.


## Running multiple tests
You can run multiple tests at once, in which case they will be executed one after another :
```javascript
// test 1
start(async function CoolTest() {
  stage('1 == 1')
    test(1 == 1)

  stage('2 == "2"')
    test(2 == "2")
})

// test 2
start(async function SuperCoolTest() {
  stage('3 == 3')
    test(3 == 3)
})
```

## That's all...

*Let's FarT!*
