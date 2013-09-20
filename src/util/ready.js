function ready(callback) {
	window.onload = function() {
		callback.apply(document, arguments);
		window.onload = null;
	};
}