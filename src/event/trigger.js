// Adapted from registerOneshotEventListener
// from Steven Fuqua's personal website.
// http://sariph.azurewebsites.net/Content/Scripts/util.js
function trigger(type, callback) {
	return this.each(function(el) {
		var action, $el = arrx(el);
		
		action = function() {
			$el.release(type, action);
			callback.apply(el, arguments);
		};
		
		$el.bind(type, action);
	});
}