function pushState(obj) {
	document.title = obj.title;
	window.history.pushState(obj, obj.title, obj.href);
}