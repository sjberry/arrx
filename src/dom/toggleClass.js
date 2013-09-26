/**
 * Toggles the specified class name on an ArrX array of DOM elements.
 *
 * @param {string} name The class to toggle on the selected set of DOM elements.
 * @returns {ArrX} The chainable ArrX array.
 */
function toggleClass(name) {
	return this.each(function(el) {
		var $el = arrx(el);
		
		if ($el.hasClass(name)) {
			$el.removeClass(name);
		}
		else {
			$el.addClass(name);
		}
	});
}