function remove(selector, context) {
	return this.each(function(el) {
		el.parentNode.removeChild(el);
	});
}