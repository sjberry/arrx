function removeClass(name) {
	return this.each(function(el) {
		el.classList.remove(name);
	});
}