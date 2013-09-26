/**
 * Returns the value of a specific query variable from a URL string.
 * 
 * @param {string} name The query variable name to retrieve.
 * @param {string} [url=location.search] The URL to scan for a query string.
 * @returns {string} The decoded query variable value from the provided URL string.
 */
function getUrlVar(name, url) {
	return getUrlVars(url)[name];
}