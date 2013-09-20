function append(selector, context) {
	var referenceNode, lastChild;
	
	referenceNode = this[0];
	lastChild = referenceNode.children[referenceNode.children.length - 1];
	
	arrx(selector, context).each(function(el) {
		referenceNode.insertBefore(el);
		lastChild = el;
	});
	
	return this;
}