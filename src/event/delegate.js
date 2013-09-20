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