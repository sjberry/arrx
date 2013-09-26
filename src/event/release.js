/**
 * Unbinds an event listener from the elements in an ArrX set.
 * 
 * @param {string} type The event type to unbind from each element.
 * @param {Function} callback The callback function that should be unbound.
 * @returns {ArrX} The chainable ArrX set.
 */
function release(type, callback) {
	var addr, result;
	
	// FIXME: This is old n' busted. Clean up.
	if (!isFunction(callback) || !callback.oid) {
		return this;
	}
	
	if (!(addr = callbackCache[callback.oid].types[type])) {
		return this;
	}
	
	result = this.each(function(el) {
		var i = 0;
		
		el.removeEventListener(type, callback);
		while (i < addr.length) {
			if (addr[i] === el) {
				addr.splice(i, 1);
				i--;
			}
			i++;
		}	
	});
	
	addr = callbackCache[callback.oid];
	if (addr.types[type].length === 0) {
		delete addr.types[type];
	}
	
	if (isEmpty(addr.types)) {
		delete callbackCache[callback.oid];
	}
	
	return result;
}