function remove() {
	this.each(function(el) {
		el.parentNode.removeChild(el);
	});
}