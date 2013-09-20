function releaseArray(arr) {
	if (arrayPool.length < MAX_POOL_SIZE) {
		arr.length = 0;
		arrayPool.push(arr);
	}	
}