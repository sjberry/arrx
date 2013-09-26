/**
 * Trims leading and trailing whitespaces from a string.
 * 
 * @param {string} val The string from which to trim whitespace.
 * @returns {string} A whitespace-trimmed string.
 */
function trim(val) {
	return val.replace(re_trim, '');
}