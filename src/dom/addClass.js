function addClass(name) {
	return this.each(function(el) {
		el.classList.add(name);
	});
}