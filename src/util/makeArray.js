function makeArray(obj) {
	if (!isDefined(obj)) {
		return [];
	}
	
	return isArray(obj) ? obj : [obj];
}