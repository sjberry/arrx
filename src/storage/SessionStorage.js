function SessionStorage() {
	this.cache = {};
}
SessionStorage.prototype = {
	set: function(key, value) {
		this.cache[key] = value;
	},
	
	get: function(key) {
		return hasProperty(this.cache, key) ? this.cache[key] : null;
	},
	
	clear: function() {
		this.cache = {};
	}
};