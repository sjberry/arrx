function each(obj, callback) {
	var i, value;
	
	for (i = 0; i < obj.length; i++) {
		value = callback(obj[i], i);
		
		if (value === false) {
			break;
		}
	}
	
	return obj;
}