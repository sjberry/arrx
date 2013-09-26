/**
 * Sets the window.onload function as a self-removing wrapper around a specified callback.
 * 
 * @param {Function} callback The callback function to bind to the window.onload event.
 */
function ready(callback) {
	window.onload = function() {
		callback.apply(document, arguments);
		window.onload = null;
	};
}