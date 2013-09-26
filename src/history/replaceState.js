function replaceState(obj) {
	document.title = obj.title;
	window.history.replaceState(obj, obj.title, obj.href);
}