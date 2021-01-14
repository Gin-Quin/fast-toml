
export default parse

import Scope from './Scope'
import { skipWhiteSpaces, trueValue, error, fragment, getLocation } from './utils'


function parse(src) {
	if (typeof src != 'string')
		src = String(src)
	const scope = new Scope
	const inlineTypes = []

	source = src
	position = 0
	let key = ''
	let val = ''
	let start, end, stop
	let c = source[0]
	let defineKey = true  // first define key, then value
	let data = {}
	let mustAssign = false
	
	// prototype pollution mitigation
	if(source.includes('__proto__') || source.includes('constructor') || source.includes('prototype')){
        	return false;
    	}

	// add a key[/val] to the data
	const addKey = () => {
		key = key.trimEnd()

		if (defineKey) {
			if (key) scope.push(trueValue(key))
		}
		else {
			if (!key)
				throw error("Expected key before =")
			if (!val)
				throw error("Expected value after =")
			scope.set(key, trueValue(val.trimEnd()))
		}

		key = ''
		val = ''
		defineKey = true
	}



	// let's start to parse
	do switch (c) {
		// useless whitespace
		case ' ':
			if (defineKey) {
				if (key)
					key += c
			}
			else if (val)
				val += c
		case '\t':
		case '\r':
		continue


		// comment
		case '#':
			position = source.indexOf('\n', position+1) - 1
			if (position == -2)
				position = Infinity
		continue



		case '"':
		case "'":
			if (!defineKey && val) {
				val += c
				continue
			}

			let triple = (source[position+1] == c && source[position+2] == c)
			end = fragment(source, position, true)

			if (defineKey) {
				if (key)
					throw error('Unexpected '+c)
				if (triple)
					key += source.slice(position+2, end-2)
				else
					key += source.slice(position, end)
				position = end
			}

			else {
				// else, we define the val
				val = source.slice(position, end)

				position = end
				if (triple) {
					val = val.slice(2, -2)
					if (val[1] == '\n')
						val = val[0] + val.slice(2)
					else if (val[1] == '\r' && val[2] == '\n')
						val = val[0] + val.slice(3)
				}
			}

			// we then skip whitespaces
			position = skipWhiteSpaces(source, position)
			c = source[position]

			// and make sure we meet a valid character
			if (c && c != ',' && c != '\n' && c !='#' && c !='}' && c !=']' && c != '=')
				throw error("Unexpected character after end of string")

			position--
		continue


		// new key
		case '\n':
		case ',':
		case undefined:
			addKey()
		continue


		// new scope
		case '[':
		case '{':
			stop = (c == '[' ? ']' : '}')

			// use global scope
			if (defineKey && !inlineTypes.length) {
				if (key)
					throw error("Unexpected "+c)
				end = fragment(source, position)

				// case '[[' -> array of table
				if (c == '[' && source[position+1] == '[') {
					if (source[end-2] != ']')
						throw error("Missing ]]")
					scope.useArray(source.slice(position+2, end-2))
				}
				else
					scope.use(source.slice(position+1, end-1))

				position = end
			}

			// enter inline scope inside inline scope (without value)
			else if (defineKey) {
				if (key)
					throw error("Unexpected "+c)
				scope.enterArray(c == '[' ? [] : {})
				inlineTypes.push(stop)
			}

			// enter inline scope
			else {
				if (val)
					throw error("Unexpected "+c)
				scope.enter(key.trimEnd(), c == '[' ? [] : {})
				inlineTypes.push(stop)
				key = ''
				defineKey = true
			}

		continue


		// exit an inline scope
		case ']':
		case '}':
			// we add the last element
			if (key)
				addKey()

			if (inlineTypes.pop() != c)
				throw error("Unexpected "+c)
			scope.exit()

			position = skipWhiteSpaces(source, position+1)
			c = source[position]

			if (c && c != ',' && c != '\n' && c !='#' && c !='}' && c !=']')
				throw error("Unexpected character after end of scope")
			position--

		continue

		// assignment
		case '=':
			if (defineKey) {
				if (!key)
					throw error("Missing key before "+c)
				defineKey = false
			}
			else
				throw error("Unexpected "+c)
		continue



		// other character
		default:
			if (defineKey)
				key += c
			else
				val += c

	} while ((c = source[++position]) || key)

	// missing } or ]
	if (inlineTypes.length)
		throw error("Missing "+inlineTypes.pop())

	return scope.root
}
