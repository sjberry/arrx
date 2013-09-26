/**
 * Removes a set of nodes from the DOM.
 * 
 * @returns {ArrX} The chainable ArrX set of removed nodes.
 */
function remove() {
	this.each(function(el) {
		el.parentNode.removeChild(el);
	});
}