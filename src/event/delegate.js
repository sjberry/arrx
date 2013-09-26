/**
 * Binds an event listener to a specified event on each element in an ArrX set.
 * The specified callback will run if the event target matches the specified
 * selector pattern relative to the bound element (i.e. catching a bubbled event
 * from a descendant node).
 * 
 * @param {string} selector The relative selector that an event target must match for the `callback` to execute.
 * @param {string} type The event type to which a listener should be bound.
 * @param {Function} callback The callback function that should be executed when the bound event fires on the listening element.
 * @returns {ArrX} The chainable ArrX set.
 */
function delegate(selector, type, callback) {
	var filter, pattern;
	
	filter = (typeof this.selector === 'string') ? this.selector : '';
	pattern = filter + ((filter.length > 0) ? ' ' : '') + selector;
	
	return this.bind(type, function(e) {
		if (arrx(e.target).matches(pattern)) {
			callback.apply(e.target, arguments);
		}
	});
}