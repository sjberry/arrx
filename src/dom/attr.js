function attr(name, val) {
	var obj, prop, properties;
	
	if (typeof name === 'string') {
		if (typeof val === 'undefined') {
			return this.get(0).getAttribute(name);
		}
		
		return this.each(function(el) {
			el.setAttribute(name, val);
		});
	}
	else {
		obj = name;
		properties = Object.keys(obj);
		
		return this.each(function(el) {
			for (var i = 0; i < properties.length; i++) {
				prop = properties[i];
				el.setAttribute(prop, obj[prop]);
			}
		});
	}
}