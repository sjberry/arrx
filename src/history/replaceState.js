/**
 * Replaces the current browser history state with the provided state object
 * by way of the HTML5 history API.
 * 
 * This function is a wrapper for the native .replaceState() method but
 * circumvents the necessary argument repetition in the native method.
 * 
 * @param {Object} obj The state object that will replace the current browser history state.
 * @config {string} title The page title of the pushed state.
 * @config {string} href The url of the pushed state.
 */
function replaceState(obj) {
	document.title = obj.title;
	window.history.replaceState(obj, obj.title, obj.href);
}