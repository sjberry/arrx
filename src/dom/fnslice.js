/**
 * Returns a subset of an ArrX array selected by a start and end indices.
 * Negative indices are supported and count back from the end of the ArrX array.
 *
 * @param {number} start The start index to slice from.
 * @param {number} [end] The end index to slice to.
 * @returns {ArrX} An ArrX array containing the re-indexed sliced element(s).
 */
function fnslice(start, end) {
	return arrx(slice(this, start, end));
}