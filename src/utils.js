
let fs  // we don't require the fileSystem yet because : 1. it may not be used, 2. it won't work on browsers

export {
	skipWhiteSpaces,
	trueValue,
	error,
	fragment,
	getLocation,
	splitElements,
	getTable,
}

/**
* Skip whitespaces : [ \t\r]
*/
function skipWhiteSpaces(str, x=0) {
	let c
	while ((c = str[x++]) && (c == ' ' || c == '\t' || c == '\r'));
	return x - 1
}


/**
* Return a true-typed value from a string value.
*/
function trueValue(val) {
	switch (val[0]) {
		case undefined:
			return ''

		case '"':
			// let's escape characters
			return escapeSpecials(val.slice(1, -1))
		case "'":
			return val.slice(1, -1)

		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		case '+':
		case '-':
		case '.':
			let num = val
			if (num.indexOf('_') != -1)
				num = num.replace(/_/g, '')
			if (!isNaN(num))
				return (+num)

			if (val[4] == '-' && val[7] == '-') {
				let date = new Date(val)
				if (date.toString() != 'Invalid Date')
					return date
			}
			else if (val[2] == ':' && val[5] == ':' && val.length >= 7) {
				let date = new Date('0000-01-01T'+val+'Z')
				if (date.toString() != 'Invalid Date')
					return date
			}
			return val
	}

	switch (val) {
		case 'true': return true
		case 'false': return false
		
		case 'nan':
		case 'NaN': return false

		case 'null': return null
		
		case 'inf':
		case '+inf':
		case 'Infinity':
		case '+Infinity': return Infinity
		case '-inf':
		case '-Infinity': return -Infinity
	}

	return val
}



/**
* Escape characters from a string
*/
function escapeSpecials(str) {
	let i, offset = 0
	let result = ''
	let elt

	while (i = str.indexOf('\\', offset) + 1) {
		result += str.slice(offset, i-1)

		switch (str[i]) {
			case '\\':
			result += '\\'
			break

			case '"':
			result += '"'
			break

			case '\r':
			if (str[i+1] == '\n')
				i++
			case '\n':
			break

			case 'b':
			result += '\b'
			break

			case 't':
			result += '\t'
			break

			case 'n':
			result += '\n'
			break

			case 'f':
			result += '\f'
			break

			case 'r':
			result += '\r'
			break

			case 'u':  // small unicode
			result += String.fromCharCode(parseInt(str.substr(i+1, 4), 16))
			i += 4
			break

			case 'U':  // big unicode
			result += String.fromCharCode(parseInt(str.substr(i+1, 8), 16))
			i += 8
			break

			default:
				throw error(str[i])
		}

		offset = i + 1
	}

	return result + str.slice(offset)
}







/**
* Create an error message with information on the line and the column
*/
function error(msg) {
	let loc = getLocation()
	let lineString = String(loc.line)
	msg += '\n'+lineString+' |  '+loc.lineContent+'\n'
	msg += ' '.repeat(lineString.length + loc.column + 2) + '^'

	return SyntaxError(msg)
}



/**
* Return the offset of the closing part of the string fragment.
* A string fragment is opened by any character among <[({'"``
* The closing characters are respectively >])}'"`
* @param swim - indicates if sub-opening and sub-closing characters must me ignored.
* For '(())', with swim=false -> '(()', with swim=true -> '(())' 
* @return - the offset of the closing character + 1
*/
function fragment(str, x=0, allowTriple=false) {
	let c = str[x]
	let end
	let start = c, stop = c
	let swim = true
	let errorOnLineBreak = false
	

	switch (c) {
		case '"':
		case "'":
			end = x+1
			if (allowTriple && str[x+1] == c && str[x+2] == c) {
				stop = c + c + c
				end += 2
			}
			else {
				errorOnLineBreak = true
			}

			// if it's a ' we don't look for escape
			if (c == "'") {
				end = str.indexOf(stop, end) + 1
			}

			// if it's a " we do look for escape
			else while (end = str.indexOf(stop, end)+1) {
				let free = true
				let s = end - 1
				while (str[--s] == '\\')
					free = !free
				if (free)
					break
			}

			if (!end)
				throw error("Missing " + stop + " closer")

			if (c != stop)
				end += 2
			else if (errorOnLineBreak) {
				let nextLineBreak = str.indexOf('\n', x+1) +1
				if (nextLineBreak && nextLineBreak < end) {
					position = nextLineBreak - 2
					throw error("Forbidden end-of-line character in single-line string")
				}
			}

		return end  // 0 if the end has not been found

		case '(':
			stop = ')'
			break
		case '{':
			stop = '}'
			break
		case '[':
			stop = ']'
			break
		case '<':
			stop = '>'
			break
		default:
			swim = false
	}

	// on trouve le délimiteur de stop
	let depth=0
	while (c = str[++x]) {
		if (c == stop) {
			if (depth == 0)
				return x + 1
			depth--
		}

		else if (c == '"' || c == "'") {
			let end = fragment(str, x, allowTriple)  // we go to the end of the string
			x = end - 1
			// else  // should we throw?
			// 	throw "Missing "+c  // at position : x
		}
		else if (swim && c == start)
			depth++
	}

	throw error("Missing "+stop)
}





/**
* Return the {column, line, position, lineContent} location object
* Read from *source* and *position*
*/
function getLocation() {
	let c = source[position]
	let offset = position
	if (c == '\n')
		offset--
	let line = 1
	let i = source.lastIndexOf('\n', offset)
	let stop = source.indexOf('\n', offset)
	if (stop == -1)
		stop = Infinity
	if (c == ',' || c == '\n')
		offset = i + 1

	if (i == -1)
		return {
			line,
			column: offset + 1,
			position: offset,
			lineContent: source.slice(0, stop).trim()
		}

	const column = offset - i + 1
	const lineContent = source.slice(i+1, stop).trim()
	line++

	while ((i = source.lastIndexOf('\n', i-1)) != -1)
		line++

	return {line, column, position: offset, lineContent}
}




/**
* Split a string scope into elements
*/
function splitElements(raw) {
	if (typeof raw != 'string')
		raw = String(raw)
	let x = -1
	let elt = ''
	let elements = []
	let end
	let c

	while (c = raw[++x]) switch (c) {
		case '.':
			if (!elt)
				throw error('Unexpected "."')
			elements.push(elt)
			elt = ''
		continue

		case '"':
		case "'":
			end = fragment(raw, x)
			if (end == x+2)
				throw error('Empty string key')
			elt += raw.slice(x+1, end-1)
			x = end-1
		continue

		default:
			elt += c
	}

	// we add the last one
	if (elt)
		elements.push(elt)

	return elements
}



/**
* Return the given object in data
* The result will/must be an object
*/
function getTable(data, elements=[]) {

	for (let elt of elements) {

		if (!(elt in data))
			data[elt] = {}

		else if (typeof data[elt] != 'object') {
			let path = '["'+elements.slice(0, elements.indexOf(elt)+1).join('"].["')+'"]'
			throw error(path + ' must be an object')
		}

		data = data[elt]
	}

	return data
}

