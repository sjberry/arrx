function before(selector, context) {
	var parentNode, referenceNode;
	
	referenceNode = this[0];
	parentNode = referenceNode.parentNode;
	
	arrx(selector, context).each(function(el) {
		parentNode.insertBefore(el, referenceNode);
	});
	
	return this;
}