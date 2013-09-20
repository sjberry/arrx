function makeObj(obj, arr) {
	var i;
	
	obj.length = arr.length;
	
	for (i = 0; i < arr.length; i++) {
		obj[i] = arr[i];
	}
	
	return obj;
}