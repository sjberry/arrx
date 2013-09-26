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