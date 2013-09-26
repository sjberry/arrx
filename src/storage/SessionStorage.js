/**
 * A pseudo window.sessionStorage used as a fallback in case sessionStorage is disabled.
 * Retains the same essential interface as window.sessionStorage, but the stored cache
 * does not persist when a browser tab is closed and re-opened or when the window.location changes
 * by way of a full GET refresh (HTML5 history works fine).
 *
 * @private
 * @class
 * @property {Object} cache A plain object hash table of stored key/value pairs.
 */
function SessionStorage() {
	this.cache = {};
}
SessionStorage.prototype = {
	/**
	 * Sets the specified key/value pair in the storage cache for later retrieval.
	 * 
	 * @param {string} key The key that will be used to reference the provided `value`.
	 * @param {*} value The value that will be stored and associated with the provided `key`.
	 */
	set: function(key, value) {
		this.cache[key] = value;
	},
	
	/**
	 * Retrieves the storage value stored with the specified key.
	 * 
	 * @param {string} key The key whose value will be retrieved from the storage cache.
	 * @returns {*} The value associated with the provided key, or `null` if the key does not exist.
	 */
	get: function(key) {
		return hasProperty(this.cache, key) ? this.cache[key] : null;
	},
	
	/**
	 * Resets the storage cache by clearing all key/value pairs.
	 */
	clear: function() {
		this.cache = {};
	}
};