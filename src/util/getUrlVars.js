/**
 * Parses a query string from a URL string and returns a plain object hashmap of key/value pairs.
 * The query variable values are automatically decoded before they are stored.
 * Memoizes the last searched query string and returns the cached value unless there is a change.
 * 
 * @param {string} [url=location.search] The URL to scan for a query string.
 * @returns {Object} A plain object hashment of query variable key/value pairs.
 */
var getUrlVars = (function() {
	// Keep a reference to the last checked query and found variables.
	// This improves performance on repeated calls to the same URL string.
	// If the query string changes, simply re-run the logic to generate the new cached map.
	var cachedQuery, cachedVars;
	
	return function(url) {
		var match, reg, vars, queryString;
		
		queryString = getQueryString(url);
		
		// Break out and return the cached object if nothing has changed.
		if (queryString === cachedQuery) {
			return cachedVars;
		}
		
		cachedQuery = queryString;
		reg = /[&;]?(\w*)=([^&^;]*)/g;
		vars = {};
		
		while (match = reg.exec(queryString)) {
			vars[match[1]] = window.decodeURIComponent(match[2]);
		}
		
		return cachedVars = vars;
	}
})();