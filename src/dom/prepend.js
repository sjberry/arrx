/**
 * Inserts a selected or created set of DOM nodes before the last child of the first element in an ArrX selected set.
 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
 * 
 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
 * @returns {ArrX} The original, chainable ArrX selected set.
 */
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