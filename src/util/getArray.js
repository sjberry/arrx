function getArray() {
	return arrayPool.pop() || [];
}