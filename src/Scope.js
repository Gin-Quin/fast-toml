
export default Scope

import { getTable, splitElements } from './utils'

/**
* The class used to manipulate the data
*/
class Scope {
	constructor(data={}) {
		this.data = data
		this.scopeList = []
	}

	
	// return the last scope
	getCurrentScope() {
		return this.scopeList[this.scopeList.length-1]
	}

	
	// merge all scope elements together
	getFullScope(extra=null) {
		let result = []
		for (let scope of this.scopeList)
			result = result.concat(scope.elements)
		if (extra)
			result = result.concat(extra)
		return result
	}


	// set a value to the data
	set(key, val) {
		let keyElements = splitElements(key)
		key = keyElements.pop()
		let elements = this.getFullScope(keyElements)
		let data = getTable(this.data, elements)
		if (typeof data == 'string')
			return data
		data[key] = val
	}

	// push a value to the data
	// (transform the mother into an array if it was an object)
	push(val) {
		// if we add directly to the main data
		if (!this.scopeList.length) {
			if (!Array.isArray(this.data)) {
				let data = this.data
				this.data = []
				Object.assign(this.data, data)
			}
			this.data.push(val)
			return this.data
		}

		let elements = this.getFullScope()
		let momName = elements.pop()
		let data = getTable(this.data, elements)
		
		// we check there is no error
		if (typeof data == 'string')
			return data

		let mom = data[momName]

		switch (typeof mom) {
			case 'object':
				if (Array.isArray(mom))
					break
			case undefined:
				data[momName] = Array()
				Object.assign(data[momName], mom)
				mom = data[momName]
			break

			default:
				return '["'+ elements.join('"].["') +'"].["'+momName+'"] must be an object'
		}
		mom.push(val)
		return mom
	}


	// use a global scope
	use(raw) {
		const scope = globalScope(raw)
		const currentScope = this.getCurrentScope()
		if (currentScope && currentScope.isGlobal)
			this.scopeList.pop()
		this.scopeList.push(scope)

		// we create the table if it does not exist
		getTable(this.data, this.getFullScope())
	}

	// use a global array scope
	useArray(raw) {
		this.use(raw)
		let mom = this.push({})
		let index = mom.length - 1
		this.use(raw+'.'+index)
	}


	// enter an inline scope
	enter(raw, isArray=false) {
		this.scopeList.push(inlineScope(raw.trimEnd()))
	
		// we create the data
		let elements = this.getFullScope()
		let baby = elements.pop()
		let mom = getTable(this.data, elements)
		
		if (!(baby in mom))
			mom[baby] = isArray ? [] : {}
	}

	// push and enter an inline array scope
	enterArray(isArray=false) {
		let array = this.push(isArray? [] : {})  // we push an empty object
		this.scopeList.push(inlineScope(array.length - 1))  // we point to the last element
	}


	// exit an inline scope
	exit() {
		let scope
		while ((scope = this.scopeList.pop()) && scope.isGlobal);
	}
}







/**
* Create a globalScope or an inlineScope object
*/
const globalScope = raw =>({
	isGlobal: true,
	elements: splitElements(raw)
})

const inlineScope = raw =>({
	isInline: true,
	elements: splitElements(raw)
})





