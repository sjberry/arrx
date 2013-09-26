/**
 * Returns the first element of an ArrX set re-wrapped in a new ArrX instance.
 *
 * @param {boolean} [preserveMeta] A boolean flag that indicates whether the selector and context from the original set should be maintained.
 * @returns {ArrX} An ArrX array containing the re-indexed sub-set element.
 */
function first(preserveMeta) {
	return this.eq(0, preserveMeta);
}