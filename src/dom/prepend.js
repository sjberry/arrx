function prepend(selector, context) {
	var referenceNode, firstChild;
	
	referenceNode = this[0];
	// Using native JS would be ideal here, but there are still some compatibility issues.
	// TODO(?): Keep an eye on when this can be implemented.
	// firstChild = referenceNode.children[0];
	firstChild = arrx(referenceNode).children().get(0);
	
	arrx(selector, context).each(function(el) {
		referenceNode.insertBefore(el, firstChild);
	});
	
	return this;
}