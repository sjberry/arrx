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