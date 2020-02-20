
export default Scope

import { getScope, getScopeAndKey, splitElements, error } from './utils'


/**
* The class used to manipulate the data
*/
class Scope {
	constructor() {
		this.root = {}
		this.data = this.root  // actual object we work with
		this.inlineScopeList = []  // list of parent scopes
	}

	get isRoot() {
		return this.data == this.root
	}

	// set a value to the data
	set(fullKey, val) {
		let [ scope, key ] = getScopeAndKey(this.data, splitElements(fullKey))
		if (typeof scope == 'string')
			throw `Wtf the scope is a string. Please report the bug`
		if (key in scope)
			throw error(`Re-writing the key '${fullKey}'`)
		scope[key] = val
		return val
	}

	// push a value to the data
	// (transform the mother into an array if it was an object)
	push(val) {
		// if the data is not an array, we transform it into an array
		if (!(this.data instanceof Array)) {
			if (this.isRoot) {
				this.data = Object.assign([], this.data)
				this.root = this.data
			}
			else throw error(`Missing key`)
		}

		this.data.push(val)
		return this
	}

	// use a global scope
	use(raw) {
		this.data = getScope(this.root, splitElements(raw))
		return this
	}

	// use a global array scope
	useArray(raw) {
		let [ scope, key ] = getScopeAndKey(this.root, splitElements(raw))
		this.data = {}
		if (scope[key] === undefined)
			scope[key] = []
		scope[key].push(this.data)
		return this
	}

	// enter an inline scope
	enter(raw, value) {
		this.inlineScopeList.push(this.data)
		this.set(raw, value)
		this.data = value
		return this
	}

	// push and enter an inline array scope
	enterArray(value) {
		this.inlineScopeList.push(this.data)
		this.push(value)
		this.data = value
		return this
	}

	// exit an inline scope
	exit() {
		this.data = this.inlineScopeList.pop()
		return this
	}
}
