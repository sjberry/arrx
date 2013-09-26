function getSupportedProperty(names) {
	var i;
	
	for (i = 0; i < names.length; i++) {
		if (names[i] in dummy.style) {
			return names[i];
		}
	}
	
	return null;
}