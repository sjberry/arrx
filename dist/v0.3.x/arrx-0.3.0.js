/** 
 * @license
 * ArrX JavaScript Library v0.1.1
 * Steven Berry, CC 3.0 Attr, http://creativecommons.org/licenses/by/3.0/us/
 * 
 * Referenced:
 *     jQuery v2.0.0 (http://code.jquery.com/jquery-2.0.0.js)
 * Subject to:
 *     Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 *     Released under the MIT license (http://jquery.org/license)
 *
 * Referenced:
 *     "Secrets of the JavaScript Ninja" by John Resig & Bear Bibeault
 * Subject to:
 *     Copyright 2013 Manning Publications Co. All rights Reserved.
 */


/*
 * Commentary:
 *
 * This is ArrX. It is a micro (?) JavaScript library that is designed for
 * my personal use (but you're free to modify/use it). I aimed to keep it extremely slender
 * by relying heavily on modern ECMAScript standards at the expense of old/obscure browser support.
 *
 * Some design paradigms are similar to what you'd find in jQuery.
 * This is because I converted my old libraries to this design style after
 * reading John Resig's excellent book "Secrets of the JavaScript Ninja."
 * 
 * I'm a fan of jQuery's prototyping elegance, and have retained its design paradigm in three respects:
 *    1) Object instantiation via prototype -- this leaves a very small memory footprint (good practice!)
 *    2) The return object structure -- which is actually just built-in native map objects "spoofed" as arrays.
 *    3) The .extend() and .fn.extend() flexibility (Retained so as not to bloat the library with site-specific code).
 *
 * Past this, I've introduced a substantial amount of my own (old) functionality that has been
 * brought in line with this new format.
 *
 * This library is not as fully-featured as jQuery, and I obviously can't recommend using
 * it in a production environment. It is designed for and used on my website.
 *
 * http://www.sberry.me/
 */

(function(window, undefined) {	
	// Static reference variables
	var location = window.location;
	var document = window.document;
	var body = window.document.body;
	var documentElement = window.document.documentElement;
	
	// Dummy HTML element initially created to support detected browser properties.
	// Can be used as a target for creating elements before adding them to the DOM.
	var dummy = document.createElement('div');
	
	// Internal RegExp patterns.
	var re_id = /^#(\S*)$/;
	var re_trim = /^\s+|\s+$/g;
	//var re_tagName = /^<(\S+)[^>]*>[\s\S]*<\/\1>$/;
	
	// Internal reference for creating and addressing objects (specifically event callbacks
	// and result-set merging which is not yet implemented).
	var gid = 0;
	
	// Compatibility flags for feature detection.
	var compat;
	// Container for event lookup (allows for unbinding event handlers).
	var callbackCache = {};
	// WebStorage Cache
	/**
	 * A pseudo window.sessionStorage used as a fallback in case sessionStorage is disabled.
	 * Retains the same essential interface as window.sessionStorage, but the stored cache
	 * does not persist when a browser tab is closed and re-opened or when the window.location changes
	 * by way of a full GET refresh (HTML5 history works fine).
	 *
	 * @private
	 * @class
	 * @property {Object} cache A plain object hash table of stored key/value pairs.
	 */
	function SessionStorage() {
		this.cache = {};
	}
	SessionStorage.prototype = {
		/**
		 * Sets the specified key/value pair in the storage cache for later retrieval.
		 * 
		 * @param {string} key The key that will be used to reference the provided `value`.
		 * @param {*} value The value that will be stored and associated with the provided `key`.
		 */
		set: function(key, value) {
			this.cache[key] = value;
		},
		
		/**
		 * Retrieves the storage value stored with the specified key.
		 * 
		 * @param {string} key The key whose value will be retrieved from the storage cache.
		 * @returns {*} The value associated with the provided key, or `null` if the key does not exist.
		 */
		get: function(key) {
			return hasProperty(this.cache, key) ? this.cache[key] : null;
		},
		
		/**
		 * Resets the storage cache by clearing all key/value pairs.
		 */
		clear: function() {
			this.cache = {};
		}
	};
	
	var storageCache = window.sessionStorage || new SessionStorage();
	
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
	
	/**
	 * Selects a browser-supported property from a provided list.
	 *
	 * @private
	 * @param {Array} names The list of names to scan for HTMLElement compatibility.
	 * @returns {string} The first property in the provided Array that is supported in the active browser.
	 */
	function getSupportedProperty(names) {
		var i;
		
		for (i = 0; i < names.length; i++) {
			if (names[i] in dummy.style) {
				return names[i];
			}
		}
		
		return null;
	}
	
	/**
	 * Adds the specified class name to an ArrX array of DOM elements.
	 *
	 * @param {string} name The class to add to the selected set of DOM elements.
	 * @returns {ArrX} The chainable ArrX set.
	 */
	function addClass(name) {
		return this.each(function(el) {
			el.classList.add(name);
		});
	}
	
	/**
	 * Inserts a selected or created set of DOM nodes after the first element in an ArrX selected set.
	 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
	 * 
	 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
	 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
	 * @returns {ArrX} The original, chainable ArrX selected set.
	 */
	function after(selector, context) {
		var parentNode, referenceNode;
		
		referenceNode = this[0];
		parentNode = referenceNode.parentNode;
		
		arrx(selector, context).each(function(el) {
			parentNode.insertBefore(el, referenceNode.nextSibling);
			// Update the reference node so that the next `el` will be inserted in order.
			referenceNode = el;
		});
		
		return this;
	}
	
	/**
	 * Inserts a selected or created set of DOM nodes after the last child of the first element in an ArrX selected set.
	 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
	 * 
	 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
	 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
	 * @returns {ArrX} The original, chainable ArrX selected set.
	 */
	function append(selector, context) {
		var referenceNode, lastChild;
		
		referenceNode = this[0];
		// Using native JS would be ideal here, but there are still some compatibility issues.
		// TODO(?): Keep an eye on when this can be implemented.
		// lastChild = referenceNode.children[referenceNode.children.length - 1];
		lastChild = arrx(referenceNode).children().get(-1);
		
		arrx(selector, context).each(function(el) {
			referenceNode.insertBefore(el);
			lastChild = el;
		});
		
		return this;
	}
	
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
	
	/**
	 * Inserts a selected or created set of DOM nodes before the first element in an ArrX selected set.
	 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
	 * 
	 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
	 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
	 * @returns {ArrX} The original, chainable ArrX selected set.
	 */
	function before(selector, context) {
		var parentNode, referenceNode;
		
		referenceNode = this[0];
		parentNode = referenceNode.parentNode;
		
		arrx(selector, context).each(function(el) {
			parentNode.insertBefore(el, referenceNode);
		});
		
		return this;
	}
	
	/**
	 * Retrieves the set of children associated with the first element in an ArrX set.
	 *
	 * @returns {ArrX} The set of children associated with the first element in the ArrX set.
	 */
	function children() {
		var node, el = this[0], children = [];
		
		node = el.firstChild;
		
		// We don't want to use .children directly because it's inconsistent and may return text nodes.
		while (node) {
			if (node.nodeType === 1) {
				children.push(node);
			}
			
			node = node.nextSibling;
		}
		
		return arrx(children);
	}
	
	/**
	 * Returns the i-th element of an ArrX set re-wrapped in a new ArrX instance.
	 * Negative indices count backwards from the end of the set. 
	 *
	 * @param {number} i The index to retrieve.
	 * @param {boolean} [preserveMeta] A boolean flag that indicates whether the selector and context from the original set should be maintained.
	 * @returns {ArrX} An ArrX array containing the re-indexed sub-set element.
	 */
	function eq(i, preserveMeta) {
		var obj = arrx(this.get(i));
		
		if (preserveMeta === true) {
			obj.selector = this.selector;
			obj.context = this.context;
		}
		
		return obj;
	}
	
	/**
	 * Returns the first element of an ArrX set re-wrapped in a new ArrX instance.
	 *
	 * @param {boolean} [preserveMeta] A boolean flag that indicates whether the selector and context from the original set should be maintained.
	 * @returns {ArrX} An ArrX array containing the re-indexed sub-set element.
	 */
	function first(preserveMeta) {
		return this.eq(0, preserveMeta);
	}
	
	/**
	 * Applies a callback function to each element in an ArrX set.
	 * Iteration is cancelled if the callback function explicitly returns `false`.
	 * 
	 * @param {Function} callback The callback function to apply to each element in the set.
	 * @returns {Array-like} The chainable ArrX set.
	 */
	function fneach(callback) {
		return each(this, callback);
	}
	
	/**
	 * Returns a subset of an ArrX array selected by a start and end indices.
	 * Negative indices are supported and count back from the end of the ArrX array.
	 *
	 * @param {number} start The start index to slice from.
	 * @param {number} [end] The end index to slice to.
	 * @returns {ArrX} An ArrX array containing the re-indexed sliced element(s).
	 */
	function fnslice(start, end) {
		return arrx(slice(this, start, end));
	}
	
	/**
	 * Returns the i-th element of an ArrX array.
	 * Negative indices are supported.
	 * Returns `undefined` if the provided index is out of range.
	 *
	 * @param {number} i The index to retrieve.
	 * @returns {*} The i-th element of the ArrX array.
	 */
	function get(i) {
		var j = i + ((i < 0) ? this.length : 0);
		
		return this[j];
	}
	
	/**
	 * Checks whether or not the first element in an ArrX array has the specified class.
	 *
	 * @param {string} name The class to check on the first element in the ArrX array.
	 * @returns {boolean} True if and only if the first element in the ArrX array has the specified class.
	 */
	function hasClass(name) {
		return this[0].classList.contains(name);
	}
	
	/**
	 * Returns the last element of an ArrX set re-wrapped in a new ArrX instance.
	 *
	 * @param {boolean} [preserveMeta] A boolean flag that indicates whether the selector and context from the original set should be maintained.
	 * @returns {ArrX} An ArrX array containing the re-indexed sub-set element.
	 */
	function last(preserveMeta) {
		return this.eq(-1, preserveMeta);
	}
	
	/**
	 * Returns a boolean indicating whether or not the first element in an ArrX set matches the specified pattern.
	 * 
	 * @param {string} pattern The CSS selector pattern to test for matching.
	 * @returns {boolean} Returns `true` IFF the first element matches the specified `pattern`.
	 */
	var matches = (function(proto) {
		var native_matches = proto.matches || proto.msMatchesSelector || proto.mozMatchesSelector || proto.webkitMatchesSelector;
		
		return function(pattern) {
			return native_matches.call(this[0], pattern);
		};
	})(HTMLElement.prototype);
	
	/**
	 * Returns a coordinate object indicating the position of the first element in an ArrX set relative to the document.
	 * 
	 * @returns {Object} An object indicating the element position with properties `top` and `left` for y and x coordinates respectively.
	 */
	function position() {
		var x = 0, y = 0, el = this[0];
		
		if (el) {			
			do {
				x += el.offsetLeft - el.scrollLeft;
				y += el.offsetTop - el.scrollTop;
			}
			while ((el = el.offsetParent) !== body)
			
			x -= Math.max(body.scrollLeft, documentElement.scrollLeft);
			y -= Math.max(body.scrollTop, documentElement.scrollTop);
			
			return {
				top: y,
				left: x
			};
		}
	}
	
	/**
	 * Inserts a selected or created set of DOM nodes before the last child of the first element in an ArrX selected set.
	 * Performs a proxy call to `arrx` using the `selector` and `context` parameters to generate the insertion set.
	 * 
	 * @param {*} selector The selector used to retrieve or create an ArrX array of DOM nodes to be inserted.
	 * @param {HTMLElement} [context=document] The root node from which to search for selected elements.
	 * @returns {ArrX} The original, chainable ArrX selected set.
	 */
	function prepend(selector, context) {
		var referenceNode, firstChild;
		
		referenceNode = this[0];
		// Using native JS would be ideal here, but there are still some compatibility issues.
		// TODO(?): Keep an eye on when this can be implemented.
		// firstChild = referenceNode.children[0];
		firstChild = arrx(referenceNode).children().get(0);
		
		arrx(selector, context).each(function(el) {
			referenceNode.insertBefore(el, firstChild);
		});
		
		return this;
	}
	
	/**
	 * Removes a set of nodes from the DOM.
	 * 
	 * @returns {ArrX} The chainable ArrX set of removed nodes.
	 */
	function remove() {
		this.each(function(el) {
			el.parentNode.removeChild(el);
		});
	}
	
	/**
	 * Removes the specified class name from an ArrX array of DOM elements.
	 *
	 * @param {string} name The class to remove from the selected set of DOM elements.
	 * @returns {ArrX} The chainable ArrX array.
	 */
	function removeClass(name) {
		return this.each(function(el) {
			el.classList.remove(name);
		});
	}
	
	/**
	 * Toggles the specified class name on an ArrX array of DOM elements.
	 *
	 * @param {string} name The class to toggle on the selected set of DOM elements.
	 * @returns {ArrX} The chainable ArrX array.
	 */
	function toggleClass(name) {
		return this.each(function(el) {
			var $el = arrx(el);
			
			if ($el.hasClass(name)) {
				$el.removeClass(name);
			}
			else {
				$el.addClass(name);
			}
		});
	}
	
	/**
	 * Binds an event listener to a specified event on each element in an ArrX set.
	 * 
	 * @param {string} type The event type to which a listener should be bound.
	 * @param {Function} callback The callback function that should be executed when the bound event fires on the target element.
	 * @returns {ArrX} The chainable ArrX set.
	 */
	function bind(type, callback) {
		var addr;
		
		// Test for this before failing on .addEventListener() since
		// the pre-processing shouldn't proceed if the call is going to fail.
		if (!isFunction(callback)) {
			return this;
		}
		
		type = getDefault(compat.events[type], type);
		
		// FIXME: The callback cache and `oid` scheme is a little wonky.
		if (!callback.oid) {
			callback.oid = ++gid;
		}
		
		callbackCache[callback.oid] = getDefault(callbackCache[callback.oid], { types: {} });
		addr = callbackCache[callback.oid];
		addr.fn = callback;
		addr.types[type] = getDefault(addr.types[type], []);
		
		return this.each(function(el) {
			addr.types[type].push(el);
			el.addEventListener(type, callback);
		});
	}
	
	/**
	 * Binds an event listener to a specified event on each element in an ArrX set.
	 * The specified callback will run if the event target matches the specified
	 * selector pattern relative to the bound element (i.e. catching a bubbled event
	 * from a descendant node).
	 * 
	 * @param {string} selector The relative selector that an event target must match for the `callback` to execute.
	 * @param {string} type The event type to which a listener should be bound.
	 * @param {Function} callback The callback function that should be executed when the bound event fires on the listening element.
	 * @returns {ArrX} The chainable ArrX set.
	 */
	function delegate(selector, type, callback) {
		var filter, pattern;
		
		filter = (typeof this.selector === 'string') ? this.selector : '';
		pattern = filter + ((filter.length > 0) ? ' ' : '') + selector;
		
		return this.bind(type, function(e) {
			if (arrx(e.target).matches(pattern)) {
				callback.apply(e.target, arguments);
			}
		});
	}
	
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
	
	/**
	 * Unbinds an event listener from the elements in an ArrX set.
	 * 
	 * @param {string} type The event type to unbind from each element.
	 * @param {Function} callback The callback function that should be unbound.
	 * @returns {ArrX} The chainable ArrX set.
	 */
	function release(type, callback) {
		var addr, result;
		
		// FIXME: This is old n' busted. Clean up.
		if (!isFunction(callback) || !callback.oid) {
			return this;
		}
		
		if (!(addr = callbackCache[callback.oid].types[type])) {
			return this;
		}
		
		result = this.each(function(el) {
			var i = 0;
			
			el.removeEventListener(type, callback);
			while (i < addr.length) {
				if (addr[i] === el) {
					addr.splice(i, 1);
					i--;
				}
				i++;
			}	
		});
		
		addr = callbackCache[callback.oid];
		if (addr.types[type].length === 0) {
			delete addr.types[type];
		}
		
		if (isEmpty(addr.types)) {
			delete callbackCache[callback.oid];
		}
		
		return result;
	}
	
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
	
	/**
	 * Returns a base object instance wrapper that:
	 * 	2) Acts as a container for ArrX prototype and extension methods.
	 * 	3) Enables prototype method chaining (where feasible)
	 * 
	 * The `selector` argument behaves according to:
	 * 	1) HTML string -> generates unattached DOM nodes according to the explicit HTML structure
	 * 	2) CSS selector string -> a list of DOM nodes that match the selector starting with `context` as the root node
	 * 	2) window/HTMLElement -> wrapped, single-element ArrX array-like object
	 * 
	 * @param {*} selector The object to be wrapped in an ArrX object.
	 * @param {HTMLElement} [context=document] The root DOM element that should be traversed.
	 * @returns {ArrX} An ArrX array-like object list of selected elements.
	 */
	function init(selector, context) {
		var arr, match;
		
		if (selector instanceof init) {
			return selector;
		}
		else if (typeof selector === 'undefined' || selector === null || selector === '') {
			arr = [];
		}
		else if (selector.nodeType || selector === window) {
			arr = [];
			this.context = this.selector = arr[0] = selector;
		}
		else if (typeof selector === 'string') {
			// TODO: Is this good enough to determine if this an HTML string?
			// Probably, since '<' isn't valid CSS...
			if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>') {
				return parseHTML(selector);
			}
			
			this.selector = selector;
			this.context = context = getDefault(context, document);
			
			match = re_id.exec(selector);				
			arr = makeArray(match ? context.getElementById(match[1]) : slice(context.querySelectorAll(selector)));
		}
		else {
			arr = makeArray(selector);
		}
		
		makeArrayLike(this, arr);
	}
	
	/**
	 * Determines whether a given object is an Array.
	 * 
	 * @param {*} [obj] The object to test as an Array type.
	 * @returns {boolean} True IFF `obj` is an Array.
	 */
	function isArray(obj) {
		return obj instanceof Array;
	}
	
	/**
	 * Determines whether a given object is considered "empty" following the stipulations:
	 * 	1) `undefined` is empty
	 * 	2) `null` is empty
	 * 	3) An Array or array-like with 0 length is empty
	 * 	4) A plain Object with no own properties is empty
	 * 
	 * @param {*} [obj] The object to test for emptiness.
	 * @returns {boolean} True IFF `obj` is empty.
	 */
	function isEmpty(obj) {
		return (typeof obj === 'undefined') ||
			(obj === null) ||
			(typeof obj.length !== 'undefined' && obj.length === 0) ||
			(isPlainObject(obj) && keys(obj).length === 0);
	}
	
	/**
	 * Determines whether a given object is a Function.
	 * 
	 * @param {*} [obj] The object to test as a Function type.
	 * @returns {boolean} True IFF `obj` is a Function.
	 */
	function isFunction(obj) {
		return obj instanceof Function;
	}
	
	/**
	 * Determines whether a given object is a plain Object.
	 * Objects created by function constructors are not considered plain objects.
	 * 
	 * @param {*} [obj] The object to test as a plain Object type.
	 * @returns {boolean} True IFF `obj` is a plain Object.
	 */
	function isPlainObject(obj) {
		return (typeof obj === 'object') && (Object.getPrototypeOf(obj) === Object.prototype);
	}
	
	/**
	 * Wraps an arbitrary object in an Array. Used internally to normalize function arguments.
	 * Returns a single-element, wrapped array (e.g. [obj]) unless:
	 * 	1) `obj` is undefined -> []
	 * 	2) `obj` is already an Array -> obj
	 * 
	 * @private
	 * @param {*} [obj] The Object to wrap in an Array.
	 * @returns {Array} An Array containing the elements in `obj`.
	 */
	function makeArray(obj) {
		if (typeof obj === 'undefined') {
			return [];
		}
		
		return isArray(obj) ? obj : [obj];
	}
	
	/**
	 * Embeds the elements in the Array `arr` into the Object `obj` making it an Array-like.
	 * The modified `obj` won't necessarily render in the console as an Array since there
	 * is no stipulation that it has a splice method.
	 * 
	 * @private
	 * @param {Object} obj The object to modify with elements from `arr`.
	 * @param {Array} arr The Array whose elements will be referenced in the passed `obj`.
	 * @returns {Object} The object referenced by `obj` after modification.
	 */
	function makeArrayLike(obj, arr) {
		var i;
		
		obj.length = arr.length;
		
		for (i = 0; i < arr.length; i++) {
			obj[i] = arr[i];
		}
		
		// Not technically necessary to return this since
		// `obj` is passed by reference... but this is fine.
		return obj;
	}
	
	/**
	 * Applies a callback function to each element in an iterable Array-like object.
	 * Iteration is cancelled if the callback function explicitly returns `false`.
	 * 
	 * @param {Array-like} arr The Array-like object to iterate over.
	 * @param {Function} callback The callback function to apply to each element in `arr`.
	 * @returns {Array-like} The originally passed Array-like object.
	 */
	function each(arr, callback) {
		var i, value;
		
		for (i = 0; i < arr.length; i++) {
			value = callback(arr[i], i);
			
			if (value === false) {
				break;
			}
		}
		
		return arr;
	}
	
	/**
	 * Copies extension properties by reference onto a base object.
	 * 
	 * @param {Object} obj The object to extend with copied properties.
	 * @param {Object} ext The extension object whose properties will be copied onto `obj`.
	 */
	function extend(obj, ext) {
		var i, prop, properties;
		
		// TODO: Remove the extra memory overhead of creating a new array.
		// A for-in loop would work tentatively, but I need to address some browser shenanigans.
		properties = keys(ext);
		for (i = 0; i < properties.length; i++) {
			prop = properties[i];
			obj[prop] = ext[prop];
		}
	}
	
	/**
	 * Returns the test value or a default value if the test parameter is `undefined`.
	 * 
	 * @private
	 * @param {*} obj The parameter to test for existence.
	 * @param {*} def The default value to return should the test parameter be `undefined`.
	 * @returns {*} Returns the test value if it is defined, otherwise the default value.
	 */
	function getDefault(obj, def) {
		return (typeof obj === 'undefined') ? def : obj;
	}
	
	/**
	 * Returns the query string component from a specified URL or the current document location.
	 * 
	 * @param {string} [url=location.search] The URL to scan for a query string.
	 * @returns {string} The query string component from the `url` argument.
	 */
	function getQueryString(url) {
		var i;
		
		if (typeof url === 'undefined') {
			return window.location.search.substring(1);
		}
		
		return ~(i = url.indexOf('?')) ? url.substring(i + 1) : '';
	}
	
	/**
	 * Returns the value of a specific query variable from a URL string.
	 * 
	 * @param {string} name The query variable name to retrieve.
	 * @param {string} [url=location.search] The URL to scan for a query string.
	 * @returns {string} The decoded query variable value from the provided URL string.
	 */
	function getUrlVar(name, url) {
		return getUrlVars(url)[name];
	}
	
	/**
	 * Parses a query string from a URL string and returns a plain object hashmap of key/value pairs.
	 * The query variable values are automatically decoded before they are stored.
	 * Memoizes the last searched query string and returns the cached value unless there is a change.
	 * 
	 * @param {string} [url=location.search] The URL to scan for a query string.
	 * @returns {Object} A plain object hashment of query variable key/value pairs.
	 */
	var getUrlVars = (function() {
		// Keep a reference to the last checked query and found variables.
		// This improves performance on repeated calls to the same URL string.
		// If the query string changes, simply re-run the logic to generate the new cached map.
		var cachedQuery, cachedVars;
		
		return function(url) {
			var match, reg, vars, queryString;
			
			queryString = getQueryString(url);
			
			// Break out and return the cached object if nothing has changed.
			if (queryString === cachedQuery) {
				return cachedVars;
			}
			
			cachedQuery = queryString;
			reg = /[&;]?(\w*)=([^&^;]*)/g;
			vars = {};
			
			while (match = reg.exec(queryString)) {
				vars[match[1]] = window.decodeURIComponent(match[2]);
			}
			
			return cachedVars = vars;
		}
	})();
	
	/**
	 * Checks an object for the specified own property.
	 * 
	 * @param {Object} obj The object to check for a property.
	 * @param {string} prop The property to check on the provided object.
	 * @returns {boolean} Returns `true` IFF `obj` has the indicated own property.
	 */
	function hasProperty(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/**
	 * Returns an array of own properties associated with a given object.
	 * 
	 * @private
	 * @param {Object} obj An object whose keys will be retrieved.
	 * @returns {Array} An array of own properties associated with the given object.
	 */
	function keys(obj) {
		return Object.keys(obj);
	}
	
	/**
	 * Static noop function to cut down on memory requirements.
	 * (i.e. arrx.noop === arrx.noop in all cases)
	 */
	function noop() {}
	
	/**
	 * Parses an HTML string into a corresponding DOM fragment.
	 * 
	 * @param {string} str The HTML string to parse into a DOM structure.
	 * @returns {ArrX} An ArrX array of generated, unattached DOM nodes.
	 */
	function parseHTML(str) {
		var i, arr, children;
		
		dummy.innerHTML = str;
		children = arrx(dummy).children();
		arr = new Array(children.length);
		
		for (i = 0; i < children.length; i++) {
			arr[i] = children[i].cloneNode(true);
		}
		
		return arrx(arr);
	}
	
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
	
	/**
	 * Returns a shallow copied subset of a specified Array-like object bound by optional start and end indices.
	 * 
	 * @param {Array-like} obj The array-like object from which to retrieve a subset.
	 * @param {number} [begin] The start index of the subset.
	 * @param {number} [end] The end index of the subset.
	 * @returns {Array} A shallow copied subset of `obj` bound by the `begin` and `end` indices.
	 */
	function slice(obj, begin, end) {
		return Array.prototype.slice.call(obj, begin, end);
	}
	
	/**
	 * Trims leading and trailing whitespaces from a string.
	 * 
	 * @param {string} val The string from which to trim whitespace.
	 * @returns {string} A whitespace-trimmed string.
	 */
	function trim(val) {
		return val.replace(re_trim, '');
	}
	
	
	// Object Definition
	function arrx(selector, context) {
		return new init(selector, context);
	}
	
	arrx.fn = init.prototype = {
		// Constants
		version: '0.2.1',
		
		// Utility
		extend: function(ext) {
			extend(arrx.fn, ext);
		},
		
		// Iterators
		each: fneach,
		
		// Element Sub-set Selection
		get: get,
		eq: eq,
		first: first,
		last: last,
		slice: fnslice,
		
		// Element Relationships
		children: children,
		
		// Element Properties
		attr: attr,
		matches: matches,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		position: position,
		
		// DOM Manipulation
		prepend: prepend,
		append: append,
		before: before,
		after: after,
		remove: remove,
		
		// Events
		bind: bind,
		trigger: trigger,
		delegate: delegate,
		release: release,
		fire: fire
	};
	
	arrx.extend = function(ext) {
		extend(arrx, ext);
	};
	
	arrx.extend({
		// Util
		ready: ready,
		noop: noop,
		each: each,
		trim: trim,
		parseHTML: parseHTML,
		
		// Types
		isArray: isArray,
		isEmpty: isEmpty,
		isFunction: isFunction,
		isPlainObject: isPlainObject,
		makeArray: makeArray,
		makeArrayLike: makeArrayLike,
		
		// URL Toolkit
		getQueryString: getQueryString,
		getUrlVars: getUrlVars,
		getUrlVar: getUrlVar,
		
		// WebStorage
		storage: {
			set: function(key, value) {
				storageCache.setItem(key, value);
			},
			
			get: function(key) {
				return storageCache.getItem(key);
			},
			
			clear: function() {
				storageCache.clear();
			}
		},
		
		// Web History
		pushState: (window.history && window.history.pushState) ? pushState : noop,
		replaceState: (window.history && window.history.replaceState) ? replaceState : noop
	});
	
	compat = {
		properties: {
			transition: getSupportedProperty(['transition', 'MozTransition', '-webkit-transition', 'OTransition']),
			animation: getSupportedProperty(['animation', 'MozAnimation', '-webkit-animation', 'OAnimation'])
		}
	};
	compat.events = {
		transitionend: getSupportedEndEvent(compat.properties.transition, 'transition'),
		animationend: getSupportedEndEvent(compat.properties.animation, 'animation')
	};
	
	arrx.compat = compat;
	window.a = window.arrx = arrx;
})(window);
