/**
 * Removes the specified class name from an ArrX array of DOM elements.
 *
 * @param {string} name The class to remove from the selected set of DOM elements.
 * @returns {ArrX} The chainable ArrX array.
 */
function removeClass(name) {
	return this.each(function(el) {
		el.classList.remove(name);
	});
}