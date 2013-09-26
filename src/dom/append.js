function append(selector, context) {
	var referenceNode, lastChild;
	
	referenceNode = this[0];
	// Using native JS would be ideal here, but there are still some compatibility issues.
	// TODO(?): Keep an eye on when this can be implemented.
	// lastChild = referenceNode.children[referenceNode.children.length - 1];
	lastChild = arrx(referenceNode).children().get(-1);
	
	arrx(selector, context).each(function(el) {
		referenceNode.insertBefore(el);
		lastChild = el;
	});
	
	return this;
}