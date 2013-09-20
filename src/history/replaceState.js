function replaceState(obj) {
	window.history.replaceState(obj, obj.title, obj.href);
}