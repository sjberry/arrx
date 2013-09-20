var matches = (function(proto) {
	var native_matches = proto.matches || proto.msMatchesSelector || proto.mozMatchesSelector || proto.webkitMatchesSelector;
	
	return function(pattern) {
		return native_matches.call(this[0], pattern);
	};
})(HTMLElement.prototype);