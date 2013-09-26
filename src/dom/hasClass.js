/**
 * Checks whether or not the first element in an ArrX array has the specified class.
 *
 * @param {string} name The class to check on the first element in the ArrX array.
 * @returns {boolean} True if and only if the first element in the ArrX array has the specified class.
 */
function hasClass(name) {
	return this[0].classList.contains(name);
}