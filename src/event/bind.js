function bind(type, callback) {
	var addr;
	
	// Test for this before failing on .addEventListener() since
	// the pre-processing shouldn't proceed if the call is going to fail.
	if (!isFunction(callback)) {
		return this;
	}
	
	type = getDefault(compat.events[type], type);
	
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