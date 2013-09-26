/**
 * Parses an HTML string into a corresponding DOM fragment.
 * 
 * @param {string} str The HTML string to parse into a DOM structure.
 * @returns {ArrX} An ArrX array of generated, unattached DOM nodes.
 */
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