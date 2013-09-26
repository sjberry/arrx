/**
 * Sets the specified attribute to the provided value on an ArrX array of DOM elements.
 * If no attribute value is specified, then the attribute value of the first element is returned.
 *
 * @param {string} name The attribute name to set on the selected set of DOM elements.
 * @param {string} val The attribute value to set on the selected set of DOM elements.
 * @returns {*} The chainable ArrX set if `val` is defined else the current attribute property.
 */
function attr(name, val) {
	var obj, prop, properties;
	
	if (typeof name === 'string') {
		if (typeof val === 'undefined') {
			return this.get(0).getAttribute(name);
		}
		
		return this.each(function(el) {
			el.setAttribute(name, val);
		});
	}
	else {
		obj = name;
		properties = Object.keys(obj);
		
		return this.each(function(el) {
			for (var i = 0; i < properties.length; i++) {
				prop = properties[i];
				el.setAttribute(prop, obj[prop]);
			}
		});
	}
}