/**
 * Determines whether a given object is a plain Object.
 * Objects created by function constructors are not considered plain objects.
 * 
 * @param {*} [obj] The object to test as a plain Object type.
 * @returns {boolean} True IFF `obj` is a plain Object.
 */
function isPlainObject(obj) {
	return (typeof obj === 'object') && (Object.getPrototypeOf(obj) === Object.prototype);
}