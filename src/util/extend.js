function extend(obj, ext) {
	var i, prop, properties;
	
	properties = keys(ext);
	for (i = 0; i < properties.length; i++) {
		prop = properties[i];
		obj[prop] = ext[prop];
	}
}