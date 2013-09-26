/**
 * Determines whether a given object is a Function.
 * 
 * @param {*} [obj] The object to test as a Function type.
 * @returns {boolean} True IFF `obj` is a Function.
 */
function isFunction(obj) {
	return obj instanceof Function;
}