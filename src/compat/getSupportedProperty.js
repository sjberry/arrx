/**
 * Selects a browser-supported property from a provided list.
 *
 * @private
 * @param {Array} names The list of names to scan for HTMLElement compatibility.
 * @returns {string} The first property in the provided Array that is supported in the active browser.
 */
function getSupportedProperty(names) {
	var i;
	
	for (i = 0; i < names.length; i++) {
		if (names[i] in dummy.style) {
			return names[i];
		}
	}
	
	return null;
}