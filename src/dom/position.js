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