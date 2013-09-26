/**
 * Pushes the provided state object onto the browser history by
 * way of the HTML5 history API.
 * 
 * This function is a wrapper for the native .pushState() method but
 * circumvents the necessary argument repetition in the native method.
 * 
 * @param {Object} obj The state object to push onto the browser history.
 * @config {string} title The page title of the pushed state.
 * @config {string} href The url of the pushed state.
 */
function pushState(obj) {
	document.title = obj.title;
	window.history.pushState(obj, obj.title, obj.href);
}