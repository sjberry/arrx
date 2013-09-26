function release(type, callback) {
	var addr, result;
	
	if (!isFunction(callback) || !callback.oid) {
		return this;
	}
	
	addr = callbackCache[callback.oid].types[type];
	if (!addr) {
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