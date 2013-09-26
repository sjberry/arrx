/**
 * Adds the specified class name to an ArrX array of DOM elements.
 *
 * @param {string} name The class to add to the selected set of DOM elements.
 * @returns {ArrX} The chainable ArrX set.
 */
function addClass(name) {
	return this.each(function(el) {
		el.classList.add(name);
	});
}