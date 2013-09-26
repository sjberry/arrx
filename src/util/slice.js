/**
 * Returns a shallow copied subset of a specified Array-like object bound by optional start and end indices.
 * 
 * @param {Array-like} obj The array-like object from which to retrieve a subset.
 * @param {number} [begin] The start index of the subset.
 * @param {number} [end] The end index of the subset.
 * @returns {Array} A shallow copied subset of `obj` bound by the `begin` and `end` indices.
 */
function slice(obj, begin, end) {
	return Array.prototype.slice.call(obj, begin, end);
}