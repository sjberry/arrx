/**
 * Copies extension properties by reference onto a base object.
 * 
 * @param {Object} obj The object to extend with copied properties.
 * @param {Object} ext The extension object whose properties will be copied onto `obj`.
 */
function extend(obj, ext) {
	var i, prop, properties;
	
	// TODO: Remove the extra memory overhead of creating a new array.
	// A for-in loop would work tentatively, but I need to address some browser shenanigans.
	properties = keys(ext);
	for (i = 0; i < properties.length; i++) {
		prop = properties[i];
		obj[prop] = ext[prop];
	}
}