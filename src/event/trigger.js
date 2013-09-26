/**
 * Binds an self-removing event listener to a specified event on each element in an ArrX set.
 * 
 * Adapted from .registerOneshotEventListener() from Steven Fuqua's personal website.
 * http://sariph.azurewebsites.net/Content/Scripts/util.js
 *
 * @param {string} type The event type to which a listener should be bound.
 * @param {Function} callback The callback function that should be executed when the bound event fires on the target element.
 * @returns {ArrX} The chainable ArrX set.
 */
function trigger(type, callback) {
	return this.each(function(el) {
		var action, $el = arrx(el);
		
		// TODO: Should there be an expiration parameter so that dangling .trigger()s don't build up?
		action = function() {
			$el.release(type, action);
			callback.apply(el, arguments);
		};
		
		$el.bind(type, action);
	});
}