/**
 * Returns the i-th element of an ArrX array.
 * Negative indices are supported.
 * Returns `undefined` if the provided index is out of range.
 *
 * @param {number} i The index to retrieve.
 * @returns {*} The i-th element of the ArrX array.
 */
function get(i) {
	var j = i + ((i < 0) ? this.length : 0);
	
	return this[j];
}