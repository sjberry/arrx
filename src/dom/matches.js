/**
 * Returns a boolean indicating whether or not the first element in an ArrX set matches the specified pattern.
 * 
 * @param {string} pattern The CSS selector pattern to test for matching.
 * @returns {boolean} Returns `true` IFF the first element matches the specified `pattern`.
 */
var matches = (function(proto) {
	var native_matches = proto.matches || proto.msMatchesSelector || proto.mozMatchesSelector || proto.webkitMatchesSelector;
	
	return function(pattern) {
		return native_matches.call(this[0], pattern);
	};
})(HTMLElement.prototype);