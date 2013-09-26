function parseHTML(str) {
	var i, arr, children;
	
	dummy.innerHTML = str;
	children = arrx(dummy).children();
	arr = new Array(children.length);
	
	for (i = 0; i < children.length; i++) {
		arr[i] = children[i].cloneNode(true);
	}
	
	return arrx(arr);
}