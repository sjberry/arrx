/**
 * Binds an event listener to a specified event on each element in an ArrX set.
 * 
 * @param {string} type The event type to which a listener should be bound.
 * @param {Function} callback The callback function that should be executed when the bound event fires on the target element.
 * @returns {ArrX} The chainable ArrX set.
 */
function bind(type, callback) {
	var addr;
	
	// Test for this before failing on .addEventListener() since
	// the pre-processing shouldn't proceed if the call is going to fail.
	if (!isFunction(callback)) {
		return this;
	}
	
	type = getDefault(compat.events[type], type);
	
	// FIXME: The callback cache and `oid` scheme is a little wonky.
	if (!callback.oid) {
		callback.oid = ++gid;
	}
	
	callbackCache[callback.oid] = getDefault(callbackCache[callback.oid], { types: {} });
	addr = callbackCache[callback.oid];
	addr.fn = callback;
	addr.types[type] = getDefault(addr.types[type], []);
	
	return this.each(function(el) {
		addr.types[type].push(el);
		el.addEventListener(type, callback);
	});
}