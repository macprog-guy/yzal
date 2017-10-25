'use strict'

let isequal   = require('lodash.isequal'),
    cloneDeep = require('lodash.clonedeep')

function strictArrayEqual(a, b) {
	return a.length === b.length && !a.find((v,i) => v !== b[i]) 
}

module.exports = function Lazy({deps, calc, strict}) {
	
	if (typeof deps !== 'function')
		throw TypeError('Lazy(deps, calc): parameter deps should be a function returning an array')

	if (typeof calc !== 'function')
		throw TypeError('Lazy(deps, calc): parameter calcs should be a function returning an array')

	let _cachedDeps,
	    _cachedValue

	let eq = strict? strictArrayEqual : isequal,
	    clone = strict? (a => [...a]) : cloneDeep

	return function LazyEval() {
		
		// Compute dependencies and hope that they are lazy too
		let _deps = deps()

		// Make sure that the dependencies is an array
		if (_deps === undefined)
			_deps = []
		else if (!Array.isArray(_deps))
			_deps = [_deps]

		// If one of the dependencies has changed recompute and cache
        if (_cachedDeps === undefined || !eq(_cachedDeps, _deps)) {
        	_cachedValue = calc(..._deps)
        	_cachedDeps  = clone(_deps)
        }

        // Return the cached value
        return _cachedValue
	}
}

