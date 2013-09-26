/**
 * Returns a base object instance wrapper that:
 * 	2) Acts as a container for ArrX prototype and extension methods.
 * 	3) Enables prototype method chaining (where feasible)
 * 
 * The `selector` argument behaves according to:
 * 	1) HTML string -> generates unattached DOM nodes according to the explicit HTML structure
 * 	2) CSS selector string -> a list of DOM nodes that match the selector starting with `context` as the root node
 * 	2) window/HTMLElement -> wrapped, single-element ArrX array-like object
 * 
 * @param {*} selector The object to be wrapped in an ArrX object.
 * @param {HTMLElement} [context=document] The root DOM element that should be traversed.
 * @returns {ArrX} An ArrX array-like object list of selected elements.
 */
function init(selector, context) {
	var arr, match;
	
	if (selector instanceof init) {
		return selector;
	}
	else if (typeof selector === 'undefined' || selector === null || selector === '') {
		arr = [];
	}
	else if (selector.nodeType || selector === window) {
		arr = [];
		this.context = this.selector = arr[0] = selector;
	}
	else if (typeof selector === 'string') {
		// TODO: Is this good enough to determine if this an HTML string?
		// Probably, since '<' isn't valid CSS...
		if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>') {
			return parseHTML(selector);
		}
		
		this.selector = selector;
		this.context = context = getDefault(context, document);
		
		match = re_id.exec(selector);				
		arr = makeArray(match ? context.getElementById(match[1]) : slice(context.querySelectorAll(selector)));
	}
	else {
		arr = makeArray(selector);
	}
	
	makeArrayLike(this, arr);
}