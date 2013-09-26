/**
 * Determines whether a given object is considered "empty" following the stipulations:
 * 	1) `undefined` is empty
 * 	2) `null` is empty
 * 	3) An Array or array-like with 0 length is empty
 * 	4) A plain Object with no own properties is empty
 * 
 * @param {*} [obj] The object to test for emptiness.
 * @returns {boolean} True IFF `obj` is empty.
 */
function isEmpty(obj) {
	return (typeof obj === 'undefined') ||
		(obj === null) ||
		(typeof obj.length !== 'undefined' && obj.length === 0) ||
		(isPlainObject(obj) && keys(obj).length === 0);
}