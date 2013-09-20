/** 
 * @license ArrX JavaScript Library v0.1.1
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
	var 
		// Static reference variables.
		location = window.location,
		document = window.document,
		body = window.document.body,
		documentElement = window.document.documentElement,
		
		// Dummy HTML element initially created to support detected browser properties.
		// Can be used as a target for creating elements before adding them to the DOM.
		dummy = document.createElement('div'),
		
		// Internal RegExp patterns.
		//regexp_id = /(?:^#)(\S+)?(?:$)/g;
		regexp_id = /^#(\S*)$/,
		regexp_trim = /^\s+|\s+$/g,
		
		// Internal reference for creating and addressing objects (specifically event callbacks
		// and result-set merging which is not yet implemented).
		gid = 0,
		
		// Container for event lookup (allows for unbinding event handlers).
		callbackCache = {},
		// WebStorage Cache
		storageCache;
	
	var
		native_slice = Array.prototype.slice,
		native_hasOwnProperty = Object.prototype.hasOwnProperty;
	
	// Object Definition
	var arrx = function(selector, context) {
		return new arrx.proto.init(selector, context);
	};
	
	arrx.proto = arrx.prototype = {
		init: function(selector, context) {
			if (!selector) {
				throw 'No selector specified.';
			}
			
			var el, match, arr;
			context = context || document;
			
			if (selector.nodeType || selector === window) {
				arr = [];
				this.context = arr[0] = selector;
			}
			else if (typeof selector === 'string') {
				this.selector = selector;
				if (match = reg_match.call(regexp_id, selector)) {
					if (el = document.getElementById(match[1])) {
						arr = [el];
						this.context = document;
					}
				}
				else {
					arr = native_slice.call(context.querySelectorAll(selector));
					this.context = context;
				}
			}
			
			return buildObj(this, arr);
		}
	};
	
	/* Internal Functions */
	var buildObj = function(obj, arr) {
		arr = arr || [];
		obj.length = arr.length;
		
		for (var i = 0; i < arr.length; i++) {
			obj[i] = arr[i];
		}
		
		return obj;
	};
	
	var reg_match = function(val) {
		return this.exec(val);
	};
	
	var extend = function(ext) {
		for (var key in ext) {
			this[key] = ext[key];
		}
	};
	/* END Internal Functions */
	
	/* Prototype */
	arrx.fn = {};
	
	arrx.fn.extend = function(ext) {
		extend.call(arrx.fn, ext);
	}
	
	arrx.fn.extend({
		noop: function() {
			return this;
		},
		
		each: function(callback) {
			return arrx.each(this, callback);
		},
		
		get: function(i) {
			var j = +i + ((i < 0) ? this.length : 0);
			
			return this[j];
		},
		
		eq: function(i, preserveMeta) {
			var obj = arrx(this.get(i));
			
			if (preserveMeta) {
				obj.selector = this.selector;
				obj.context = this.context;
			}
			
			return obj;
		},
		
		first: function(preserveMeta) {
			return this.eq(0, preserveMeta);
		},
		
		last: function(preserveMeta) {
			return this.eq(-1, preserveMeta);
		},
		
		bind: function(type, callback) {
			var addr;
			
			// Test for this before failing on .addEventListener() since
			// the pre-processing shouldn't proceed if the call is going to fail.
			if (!arrx.isFunction(callback)) {
				return this;
			}
			
			type = compat.events[type] || type;
			
			if (!callback.oid) {
				callback.oid = ++gid;
			}
			
			callbackCache[callback.oid] = callbackCache[callback.oid] || { types: {} };
			addr = callbackCache[callback.oid];
			addr.fn = callback;
			addr.types[type] = addr.types[type] || [];
			
			return this.each(function(i, el) {
				addr.types[type].push(el);
				el.addEventListener(type, callback);
			});
		},
		
		// Adapted from registerOneshotEventListener
		// from Steven Fuqua's personal website.
		// http://sariph.azurewebsites.net/Content/Scripts/util.js
		trigger: function(type, callback) {
			type = compat.events[type] || type;
			
			var action = function(e) {
				arrx(this).release(type, action);
				callback.call(this, e);
			};
			
			return this.bind(type, action);
		},
		
		release: function(type, callback) {
			var addr, result;
			
			if (!arrx.isFunction(callback) || !callback.oid) {
				return this;
			}
			
			addr = callbackCache[callback.oid].types[type];
			if (!addr) {
				return this;
			}
			
			result = this.each(function(i, el) {
				el.removeEventListener(type, callback);
				
				var i = 0;
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
			if (arrx.isEmptyObj(addr.types)) {
				delete callbackCache[callback.oid];
			}
			
			return result;
		},
		
		fire: function(type, bubbles, cancelable) {
			bubbles = (typeof bubbles === 'undefined') ? false : bubbles;
			cancelable = (typeof cancelable === 'undefined') ? false : cancelable;
			
			// TODO: Extend this to support multiple Event Modules.
			// https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent#Notes
			var evt = document.createEvent('Event');
			evt.initEvent(type, bubbles, cancelable);
			
			return this.each(function(i, el) {
				el.dispatchEvent(evt);
			});
		},
		
		attr: function(name, val) {
			if (typeof val !== 'undefined') {
				return this[0].setAttribute(name, val);
			}
			
			return this[0].getAttribute(name);
		},
		
		getPosition: function(el) {
			return this.each(function(i, el) {
				var x = 0, y = 0;
				
				do {
					x += el.offsetLeft - el.scrollLeft;
					y += el.offsetTop - el.scrollTop;
				}
				while ((el = el.offsetParent) !== document.body)
				
				x -= Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
				y -= Math.max(document.body.scrollTop, document.documentElement.scrollTop);
				
				el.x = x;
				el.y = y;
			});
		}
		
		/*
		insertAfter: function(newNode, referenceNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		}
		*/
	});
	
	/* END Prototype */
	
	/* Utility */
	arrx.extend = function(ext) {
		extend.call(arrx, ext);
	};
	
	arrx.extend({
		noop: function() {
		},
		
		isEmptyObj: function(obj) {
			return Object.getOwnPropertyNames(obj).length === 0;
		},
		
		isFunction: function(obj) {
			return typeof obj === 'function';
		},
		
		each: function(obj, callback) {
			var value;
			var length = obj.length;
			
			for (var i = 0; i < obj.length; i++) {
				value = callback.call(obj[i], i, obj[i]);
				
				if (value === false) {
					break;
				}
			}
			
			return obj;
		},
		
		trim: function(val) {
			return val.replace(regexp_trim, '');
		},
		
		ready: function(callback) {
			window.onload = function() {
				callback();
				window.onload = null;
			}
		}
	});
	/* END Utility */
	
	// Compatibility
	var native_matches = (function() {
		return this.matches || this.msMatchesSelector || this.mozMatchesSelector || this.webkitMatchesSelector;
	}).call(HTMLElement.prototype);
	
	var getSupportedProperty = function(names) {
		for (var i = 0; i < names.length; i++) {
			if (names[i] in dummy.style) {
				return names[i];
			}
		}
		return null;
	};
	
	var getSupportedEndEvent = function(prop, type) {
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
	};
	
	var compat = {};
	compat.supports = {
		classList: !!dummy.classList,
		matches: !!native_matches,
		history: !!window.history && !!window.history.pushState,
		sessionStorage: !!window.sessionStorage
	};
	compat.properties = {
		transition: getSupportedProperty(['transition', 'MozTransition', '-webkit-transition', 'OTransition']),
		animation: getSupportedProperty(['animation', 'MozAnimation', '-webkit-animation', 'OAnimation'])
	};
	compat.events = {
		transitionend: getSupportedEndEvent(compat.properties.transition, 'transition'),
		animationend: getSupportedEndEvent(compat.properties.animation, 'animation')
	};
	
	if (compat.supports.classList) {
		arrx.fn.extend({
			hasClass: function(name) {
				return this[0].classList.contains(name);
			},
			
			addClass: function(name) {
				return this.each(function(i, el) {
					el.classList.add(name);
				});
			},
			
			removeClass: function(name) {
				return this.each(function(i, el) {
					el.classList.remove(name);
				});
			}
		});
	}
	else {
		arrx.fn.extend({
			hasClass: function(name) {
				return this[0].className.indexOf(name) >= 0;
			},
			
			addClass: function(name) {
				return this.each(function(i, el) {
					if (el.className.indexOf(name) < 0) {
						el.className += ' ' + name;
					}
				});
			},
			
			removeClass: function(name) {
				return this.each(function(i, el) {
					var
						classes = el.className.split(' '),
						newClass = [];
					
					for (var i = 0; i < classes.length; i++) {
						if (classes[i] != name && classes[i].length > 0) {
							newClass.push(classes[i])
						}
					}
					
					el.className = newClass.join(' ');
				});
			}
		});
	}
	
	if (compat.supports.matches) {
		arrx.fn.extend({
			matches: function(selector) {
				return native_matches.call(this[0], selector);
			},
			
			delegate: function(selector, type, callback) {
				var filter, pattern;
				
				type = compat.events[type] || type;
				filter = this.selector || '';
				pattern = filter + ((filter.length > 0) ? ' ' : '') + selector;
				
				return this.bind(type, function(e) {
					if (arrx(e.target).matches(pattern)) {
						callback.call(e.target, e);
					}
				});
			}
		});
	}
	
	if (compat.supports.history) {
		arrx.extend({
			pushState: function(obj) {
				document.title = obj.title;
				window.history.pushState(obj, obj.title, obj.href);
			},
			
			replaceState: function(obj) {
				window.history.replaceState(obj, obj.title, obj.href);
			}
		});
	}
	
	if (compat.supports.sessionStorage) {
		storageCache = window.sessionStorage;
		arrx.extend({
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
			}
		});
	}
	else {
		storageCache = {};
		arrx.extend({
			storage: {
				set: function(key, value) {
					storageCache[key] = value;
				},
				
				get: function(key) {
					return native_hasOwnProperty.call(storageCache, key) ? storageCache[key] : null;
				},
				
				clear: function() {
					storageCache = {};
				}
			}
		});
	}
	// END Compatibility
	
	// Debugging
	window.debug = callbackCache;
	
	// Publish to global scope.	
	arrx.proto.init.prototype = arrx.fn;
	arrx.compat = compat;
	window.a = window.arrx = arrx;
})(window);