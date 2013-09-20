function eq(i, preserveMeta) {
	var obj = arrx(this.get(i));
	
	if (preserveMeta === true) {
		obj.selector = this.selector;
		obj.context = this.context;
	}
	
	return obj;
}