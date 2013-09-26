/**
 * Wraps an arbitrary object in an Array. Used internally to normalize function arguments.
 * Returns a single-element, wrapped array (e.g. [obj]) unless:
 * 	1) `obj` is undefined -> []
 * 	2) `obj` is already an Array -> obj
 * 
 * @private
 * @param {*} [obj] The Object to wrap in an Array.
 * @returns {Array} An Array containing the elements in `obj`.
 */
function makeArray(obj) {
	if (typeof obj === 'undefined') {
		return [];
	}
	
	return isArray(obj) ? obj : [obj];
}