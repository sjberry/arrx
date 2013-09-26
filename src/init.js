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
	
	makeArrayLike(this, arr);
}