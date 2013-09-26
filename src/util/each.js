function each(arr, callback) {
	var i, value;
	
	for (i = 0; i < arr.length; i++) {
		value = callback(arr[i], i);
		
		if (value === false) {
			break;
		}
	}
	
	return arr;
}