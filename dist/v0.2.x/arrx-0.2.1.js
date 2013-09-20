/** 
 * @license
 * ArrX JavaScript Library v0.2.1
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
 *
 */


/*
 * Commentary:
 *
 * This is ArrX. It is a micro (?) js library that is designed for
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
 *    3) The .extend and .fn.extend flexibility (Retained so as not to bloat the library with site-specific code).
 *
 * Past this, I've introduced a substantial amount of my own (old) functionality that has been
 * brought in line with this new format.
 *
 * This library is not as fully-featured as jQuery, and I obviously can't recommend using
 * it in a production environment. It is designed for and used on my website.
 *
 * http://www.sberry.me/
 *
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
	var re_tagName = /^<(\S+)[^>]*>[\s\S]*<\/\1>$/;
	
	// Internal reference for creating and addressing objects (specifically event callbacks
	// and result-set merging which is not yet implemented).
	var gid = 0;
	
	// Compatibility flags for feature detection.
	var compat;
	// Container for event lookup (allows for unbinding event handlers).
	var callbackCache = {};
	// WebStorage Cache
	function SessionStorage() {
		this.cache = {};
	}
	SessionStorage.prototype = {
		set: function(key, value) {
			this.cache[key] = value;
		},
		
		get: function(key) {
			return hasProperty(this.cache, key) ? this.cache[key] : null;
		},
		
		clear: function() {
			this.cache = {};
		}
	};
	
	var storageCache = window.sessionStorage ? window.sessionStorage : new SessionStorage();
	
	var arrayPool = [];
	var MAX_POOL_SIZE = 50;
	
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
	
	function getSupportedProperty(names) {
		for (var i = 0; i < names.length; i++) {
			if (names[i] in dummy.style) {
				return names[i];
			}
		}
		
		return null;
	}
	
	function addClass(name) {
		return this.each(function(el) {
			el.classList.add(name);
		});
	}
	
	function after(selector, context) {
		var parentNode, referenceNode;
		
		referenceNode = this[0];
		parentNode = referenceNode.parentNode;
		
		arrx(selector, context).each(function(el) {
			parentNode.insertBefore(el, referenceNode.nextSibling);
			referenceNode = el;
		});
		
		return this;
	}
	
	function append(selector, context) {
		var referenceNode, lastChild;
		
		referenceNode = this[0];
		lastChild = referenceNode.children[referenceNode.children.length - 1];
		
		arrx(selector, context).each(function(el) {
			referenceNode.insertBefore(el);
			lastChild = el;
		});
		
		return this;
	}
	
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
	
	function before(selector, context) {
		var parentNode, referenceNode;
		
		referenceNode = this[0];
		parentNode = referenceNode.parentNode;
		
		arrx(selector, context).each(function(el) {
			parentNode.insertBefore(el, referenceNode);
		});
		
		return this;
	}
	
	function eq(i, preserveMeta) {
		var obj = arrx(this.get(i));
		
		if (preserveMeta === true) {
			obj.selector = this.selector;
			obj.context = this.context;
		}
		
		return obj;
	}
	
	function first(preserveMeta) {
		return this.eq(0, preserveMeta);
	}
	
	function fneach(callback) {
		return each(this, callback);
	}
	
	/**
	 * An arrx prototype function that returns the i-th element of an arrx object.
	 * Returns `undefined` if the provided index is out of range.
	 *
	 * @param {number} i The index to retrieve.
	 * @returns {*} The i-th element of the arrx object.
	 */
	function get(i) {
		var j = i + ((i < 0) ? this.length : 0);
		
		return this[j];
	}
	
	function hasClass(name) {
		return this[0].classList.contains(name);
	}
	
	function last(preserveMeta) {
		return this.eq(-1, preserveMeta);
	}
	
	var matches = (function(proto) {
		var native_matches = proto.matches || proto.msMatchesSelector || proto.mozMatchesSelector || proto.webkitMatchesSelector;
		
		return function(pattern) {
			return native_matches.call(this[0], pattern);
		};
	})(HTMLElement.prototype);
	
	function position() {
		var x = 0, y = 0, el = this[0];
		
		if (el) {			
			do {
				x += el.offsetLeft - el.scrollLeft;
				y += el.offsetTop - el.scrollTop;
			}
			while ((el = el.offsetParent) !== document.body)
			
			x -= Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
			y -= Math.max(document.body.scrollTop, document.documentElement.scrollTop);
			
			return {
				top: y,
				left: x
			};
		}
	}
	
	function prepend(selector, context) {
		var referenceNode, firstChild;
		
		referenceNode = this[0];
		firstChild = referenceNode.children[0];
		
		arrx(selector, context).each(function(el) {
			referenceNode.insertBefore(el, firstChild);
		});
		
		return this;
	}
	
	function remove(selector, context) {
		return this.each(function(el) {
			el.parentNode.removeChild(el);
		});
	}
	
	function removeClass(name) {
		return this.each(function(el) {
			el.classList.remove(name);
		});
	}
	
	function bind(type, callback) {
		var addr;
		
		// Test for this before failing on .addEventListener() since
		// the pre-processing shouldn't proceed if the call is going to fail.
		if (!isFunction(callback)) {
			return this;
		}
		
		type = getDefault(compat.events[type], type);
		
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
	
	function release(type, callback) {
		var addr, result;
		
		if (!isFunction(callback) || !callback.oid) {
			return this;
		}
		
		addr = callbackCache[callback.oid].types[type];
		if (!addr) {
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
		if (isEmptyObj(addr.types)) {
			delete callbackCache[callback.oid];
		}
		
		return result;
	}
	
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
	
	function pushState(obj) {
		document.title = obj.title;
		window.history.pushState(obj, obj.title, obj.href);
	}
	
	function replaceState(obj) {
		window.history.replaceState(obj, obj.title, obj.href);
	}
	
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
			if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>') {
				return parseHTML(selector);
				/*
				if (match = re_tagName.exec(selector)) {
					dummy.innerHTML = selector;
					return arrx(dummy.children[0].cloneNode(true));
				}
				*/
			}
			
			this.selector = selector;
			this.context = context = getDefault(context, document);
			
			match = re_id.exec(selector);				
			arr = makeArray(match ? context.getElementById(match[1]) : slice(context.querySelectorAll(selector)));
		}
		else {
			arr = makeArray(selector);
		}
		
		return makeObj(this, arr);
	}
	
	function each(obj, callback) {
		var i, value;
		
		for (i = 0; i < obj.length; i++) {
			value = callback(obj[i], i);
			
			if (value === false) {
				break;
			}
		}
		
		return obj;
	}
	
	function extend(obj, ext) {
		var i, prop, properties;
		
		properties = keys(ext);
		for (i = 0; i < properties.length; i++) {
			prop = properties[i];
			obj[prop] = ext[prop];
		}
	}
	
	function getArray() {
		return arrayPool.pop() || [];
	}
	
	function getDefault(obj, def) {
		return isDefined(obj) ? obj : def;
	}
	
	function hasProperty(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	function isArray(obj) {
		return obj instanceof Array;
	}
	
	function isDefined(obj) {
		return typeof obj !== 'undefined';
	}
	
	function isEmptyObj(obj) {
		return keys(obj).length === 0;
	}
	
	function isFunction(obj) {
		return obj instanceof Function;
	}
	
	function keys(obj) {
		return Object.keys(obj);
	}
	
	function makeArray(obj) {
		if (!isDefined(obj)) {
			return [];
		}
		
		return isArray(obj) ? obj : [obj];
	}
	
	function makeObj(obj, arr) {
		var i;
		
		obj.length = arr.length;
		
		for (i = 0; i < arr.length; i++) {
			obj[i] = arr[i];
		}
		
		return obj;
	}
	
	function noop() {}
	
	function parseHTML(str) {
		var i, arr, children;
		
		dummy.innerHTML = str;
		children = dummy.children;
		arr = new Array(children.length);
		
		for (i = 0; i < children.length; i++) {
			arr[i] = children[i].cloneNode(true);
		}
		
		return arrx(arr);
	}
	
	function ready(callback) {
		window.onload = function() {
			callback.apply(document, arguments);
			window.onload = null;
		};
	}
	
	function releaseArray(arr) {
		if (arrayPool.length < MAX_POOL_SIZE) {
			arr.length = 0;
			arrayPool.push(arr);
		}	
	}
	
	function slice(obj, begin, end) {
		return Array.prototype.slice.call(obj, begin, end);
	}
	
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
		
		// Element Selection
		get: get,
		eq: eq,
		first: first,
		last: last,
		
		// Element Properties
		attr: attr,
		matches: matches,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
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
		noop: noop,
		each: each,
		trim: trim,
		ready: ready,
		
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
