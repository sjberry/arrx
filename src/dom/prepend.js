function prepend(selector, context) {
	var referenceNode, firstChild;
	
	referenceNode = this[0];
	firstChild = referenceNode.children[0];
	
	arrx(selector, context).each(function(el) {
		referenceNode.insertBefore(el, firstChild);
	});
	
	return this;
}