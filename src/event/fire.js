function fire(type, bubbles, cancelable) {
	var evt;
	
	bubbles = getDefault(bubbles, false);
	cancelable = getDefault(cancelable, false);
	
	// TODO: Extend this to support multiple Event Modules.
	// https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent#Notes
	evt = document.createEvent('Event');
	evt.initEvent(type, bubbles, cancelable);
	
	return this.each(function(el) {
		el.dispatchEvent(evt);
	});
}