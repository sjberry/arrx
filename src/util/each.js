/**
 * Applies a callback function to each element in an iterable Array-like object.
 * Iteration is cancelled if the callback function explicitly returns `false`.
 * 
 * @param {Array-like} arr The Array-like object to iterate over.
 * @param {Function} callback The callback function to apply to each element in `arr`.
 * @returns {Array-like} The originally passed Array-like object.
 */
function each(arr, callback) {
	var i, value;
	
	for (i = 0; i < arr.length; i++) {
		value = callback(arr[i], i);
		
		if (value === false) {
			break;
		}
	}
	
	return arr;
}