/**
 * Retrieves the set of children associated with the first element in an ArrX set.
 *
 * @returns {ArrX} The set of children associated with the first element in the ArrX set.
 */
function children() {
	var i, node, el = this[0], children = [];
	
	node = el.firstChild;
	
	// We don't want to use .children directly because it's inconsistent and may return text nodes.
	while (node) {
		if (node.nodeType === 1) {
			children.push(node);
		}
		
		node = node.nextSibling;
	}
	
	return arrx(children);
}