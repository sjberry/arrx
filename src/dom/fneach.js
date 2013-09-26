/**
 * Applies a callback function to each element in an ArrX set.
 * Iteration is cancelled if the callback function explicitly returns `false`.
 * 
 * @param {Function} callback The callback function to apply to each element in the set.
 * @returns {Array-like} The chainable ArrX set.
 */
function fneach(callback) {
	return each(this, callback);
}