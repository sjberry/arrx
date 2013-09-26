/**
 * Checks an object for the specified own property.
 * 
 * @param {Object} obj The object to check for a property.
 * @param {string} prop The property to check on the provided object.
 * @returns {boolean} Returns `true` IFF `obj` has the indicated own property.
 */
function hasProperty(obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}