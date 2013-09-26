/**
 * Inserts a selected or created set of DOM nodes after the first element in an ArrX selected set.
 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
 * 
 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
 * @returns {ArrX} The original, chainable ArrX selected set.
 */
function after(selector, context) {
	var parentNode, referenceNode;
	
	referenceNode = this[0];
	parentNode = referenceNode.parentNode;
	
	arrx(selector, context).each(function(el) {
		parentNode.insertBefore(el, referenceNode.nextSibling);
		// Update the reference node so that the next `el` will be inserted in order.
		referenceNode = el;
	});
	
	return this;
}