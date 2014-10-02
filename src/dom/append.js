/**
 * Inserts a selected or created set of DOM nodes after the last child of the first element in an ArrX selected set.
 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
 * 
 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
 * @returns {ArrX} The original, chainable ArrX selected set.
 */
function append(selector, context) {
	var referenceNode, lastChild;
	
	referenceNode = this[0];
	// Using native JS would be ideal here, but there are still some compatibility issues.
	// TODO(?): Keep an eye on when this can be implemented.
	// lastChild = referenceNode.children[referenceNode.children.length - 1];
	lastChild = arrx(referenceNode).children().get(-1);
	
	// TODO: Benchmark this with a document fragment and see if that would yield
	// computational benefits. Is there a breakeven point for the overhead of the double insert?
	arrx(selector, context).each(function(el) {
		referenceNode.insertBefore(el);
		lastChild = el;
	});
	
	return this;
}