/**
 * Returns the query string component from a specified URL or the current document location.
 * 
 * @param {string} [url=location.search] The URL to scan for a query string.
 * @returns {string} The query string component from the `url` argument.
 */
function getQueryString(url) {
	var i;
	
	if (typeof url === 'undefined') {
		return window.location.search.substring(1);
	}
	
	return ~(i = url.indexOf('?')) ? url.substring(i + 1) : '';
}