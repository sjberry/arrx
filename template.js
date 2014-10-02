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
(function(root, factory) {
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = factory.call(root);
	}
	else if (typeof define === 'function' && define.amd) {
		define('arrx', [], function() {
			return factory.apply(root, arguments);
		});
	}
	else if (typeof root === 'object' && root && typeof root.document === 'object') {
		root.$ = root.ArrX = factory.call(root).ArrX;
	}
})(this, function(undefined) {
	// Static reference variables
	var window = this;
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
	@include "src/storage"
	var storageCache = window.sessionStorage || new SessionStorage();

	@include "src"

	// Object Definition
	function ArrX(selector, context) {
		return new init(selector, context);
	}

	ArrX.fn = init.prototype = {
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

	ArrX.extend = function(ext) {
		extend(ArrX, ext);
	};

	ArrX.extend({
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
	
	ArrX.compat = compat;
	
	return {
		ArrX: ArrX
	};
});