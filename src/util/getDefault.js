/**
 * Returns the test value or a default value if the test parameter is `undefined`.
 * 
 * @private
 * @param {*} obj The parameter to test for existence.
 * @param {*} def The default value to return should the test parameter be `undefined`.
 * @returns {*} Returns the test value if it is defined, otherwise the default value.
 */
function getDefault(obj, def) {
	return (typeof obj === 'undefined') ? def : obj;
}