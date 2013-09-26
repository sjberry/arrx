/**
 * Embeds the elements in the Array `arr` into the Object `obj` making it an Array-like.
 * The modified `obj` won't necessarily render in the console as an Array since there
 * is no stipulation that it has a splice method.
 * 
 * @private
 * @param {Object} obj The object to modify with elements from `arr`.
 * @param {Array} arr The Array whose elements will be referenced in the passed `obj`.
 * @returns {Object} The object referenced by `obj` after modification.
 */
function makeArrayLike(obj, arr) {
	var i;
	
	obj.length = arr.length;
	
	for (i = 0; i < arr.length; i++) {
		obj[i] = arr[i];
	}
	
	// Not technically necessary to return this since
	// `obj` is passed by reference... but this is fine.
	return obj;
}