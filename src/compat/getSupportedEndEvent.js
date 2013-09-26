/**
 * Returns the browser-specific end event based on the provided supported property.
 *
 * @private
 * @param {string} prop The browser-specific property.
 * @param {string} type The end-event type to scan.
 */
function getSupportedEndEvent(prop, type) {
	var capped, lower;
	
	lower = type.toLowerCase();
	capped = lower.replace(/^./, function(ch) { return ch.toUpperCase(); });
	
	switch (prop) {
		case type:
			return lower + 'end';
		case 'Moz' + capped:
			return lower + 'end';
		case '-webkit-' + lower:
			return 'webkit' + capped + 'End';
		case 'O' + capped:
			return 'o' + capped + 'End';
		default:
			return null;
	}
}