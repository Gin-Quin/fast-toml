# Fast TOML Parser for Node.js

`fast-toml` is the fastest and lightest Javascript parser for TOML files (see [benchmarks](#benchmarks) below).

TOML stands for **T**om's **O**bvious and **M**inimal **L**anguage and it is an awesome language for your configuration files, better than JSON and YAML on many aspects. [Learn here](https://github.com/toml-lang/toml) what is TOML and how to use it (it's definitely worth the ten minutes learning).


## Usage
First, install fast-toml : `npm i fast-toml`.

Then, let's suppose we have the following TOML file :

```
# myFile.toml
title = 'Hey universe'

[soundOptions]
volume = 68
soundName = 'Hey universe'
file = 'sounds/hey-universe.mp3'
```

We read the file and transform it into a javascript object this way :

```javascript
const TOML = require('fast-toml')
const fs = require('fs')

const tomlString = String(fs.readFileSync('myFile.toml'))
const data = TOML.parse(tomlString)
console.log(data.title)  // 'Hey universe'
console.log(data.soundOptions.volume)  // 68
```

### TOML.parseFile
If you want to read from a file, you can directly use the `TOML.parseFile` or `TOML.parseFileSync` functions :

```javascript
const TOML = require('fast-toml')

// async / await (any error will be thrown)
const data = await TOML.parseFile('myFile.toml')
console.log(data)

// sync (any error will be thrown)
const data = TOML.parseFileSync('myFile.toml')
console.log(data)

// promise (we catch errors in a callback)
TOML.parseFile('myFile.toml')
.then(data => console.log(data))
.catch(err => console.error(err))

```


### Javascript template strings
You also can use the parser with Javascript template strings :

```javascript
const TOML = require('fast-toml')
const data = TOML `
  title = 'Hey universe'

  [soundOptions]
  volume = 68
  soundName = 'Hey universe'
  file = 'sounds/hey-universe.mp3'
`
console.log(data.title)  // 'Hey universe'
console.log(data.soundOptions.volume)  // 68
```


### Using in browser
You can download the browser version of fast-toml [here](https://github.com/Lepzulnag/fast-toml/blob/master/dist/browser/fast-toml.js).

Just add the file to your project and require it with a script tag. You can then use the globally defined `TOML` object.


## <a name="benchmarks"></a> Speed and size comparison with other parsers
Here is the comparison between **fast-toml** and the other 0.5.0-compliant TOML parsers for Javascript :

- [Iarna](https://www.npmjs.com/package/@iarna/toml)'s toml
- [LongTengDao](https://www.npmjs.com/package/@ltd/j-toml)'s j-toml
- [Bombadil](https://www.npmjs.com/package/@sgarciac/bombadil) (wich use the *Chevrotain Parser Building Toolkit*)

|                                                                 | fast-toml | Iarna's toml | j-toml | Bombadil |
|-----------------------------------------------------------------|------------|--------------|----------------------|----------|
| Require                                                         | **2.375**      | 14.720       | 5.969                | 196.741  |
| First round                                                     | **9.489**      | 13.911       | 12.267               | 69.970   |
| One-use *(require+first round)*                                   | **11.864**     | 28.631       | 18.236               | 266.711  |
| Warm round                                                      | 1.483      | 7.275        | **1.420**                | 34.878   |
| Hot round                                                       | **0.501**      | 0.604        | 0.627                | 6.639    |
| Package size | **12.7 ko**    | 93.1 ko      | 261 ko               | +3000 ko |

*(All time values are milliseconds)*




The comparison has been made in a Node 11.2.0 environment with this medium-size [sample TOML file](https://gist.github.com/robmuh/7966da29024c075349a963840e2298b2), which covers about all the different ways to use TOML.

The comparison has been made in three rounds because of the way Javascript works :

* For the first round, the Javascript engine has done no compilation yet. The functions are directly interpreted when evaluated.
* After a fisrt round, the Javascript engine will do some light compilation called *warming*. That's why the second call is faster than the first.
* If a function is called many times, the Javascript engine will do *hot* compilation optimisations so that the function runs super-fast.

Bombadil is so big and slow compared to others parsers because it uses a third-party library (Chevrotain) - even though Chevrotain is describing itself as 'blazing fast' (as everyone does nowadays :p).

`fast-toml` is also robust. Errors are prettily handled, giving you clear informations about bad syntaxes.


### Note about package size
In actual NodeJs package ecosystem, your imported libraries can grow very fast in size. Because they import other libraries themselves, which also import their own libraries, etc... Furthermore, most libraries carry a lot of stuff you absolutely don't need.

The package size of `fast-toml` is so small because it follows this principle :

- the source code (+ your tests + dev dependencies), should be on github/gitlab or similar. Users who want to collaborate on your project will **git clone** it (not **npm install** it).
- your npm package should only contain the *useful code* (production-ready). When you use a third party library, you expect it has been battle-tested and you don't need the development version. If you have several versions of your code (CommonJS, ESmodules, browser), you should have one package for each of these versions.


## Permissivity

`fast-toml` is a bit more permissive than his brothers and sisters. Especially :

- line breaks make commas optionals in inline arrays and tables,
- unrecognized value types will be treated as strings (which makes quotes optional),
- if you define a table and add an element with a value but no key, the table will be considered as an array.

These small tweaks make the TOML language even more comfortable to read and write, but be aware *they are not standard*.
