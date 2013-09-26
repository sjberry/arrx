/**
 * Fires an event on the elements in an ArrX set.
 * 
 * @param {string} type The event type to fire.
 * @param {boolean} bubbles A flag indicating whether or not the fired event will bubble to parent nodes.
 * @param {boolean} cancelable A flag indicating whether the default action of the event can be cancelled.
 * @returns {ArrX} The chainable ArrX set.
 */
function fire(type, bubbles, cancelable) {
	var evt;
	
	bubbles = getDefault(bubbles, false);
	cancelable = getDefault(cancelable, true);
	
	// TODO: Extend this to support multiple Event Modules.
	// https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent#Notes
	evt = document.createEvent('Event');
	evt.initEvent(type, bubbles, cancelable);
	
	// TODO: Update this to use CustomEvent
	// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	
	return this.each(function(el) {
		el.dispatchEvent(evt);
	});
}