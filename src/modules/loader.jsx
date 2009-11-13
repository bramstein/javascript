require.loader = (function () {
	return {
		/**
		 * Returns a module factory function.
		 */
		load: function (identifier) {
			return function (require, exports, system) {
			};
		},

		/**
		 * Returns the text of a module for a given normalized, fully-qualified, absolute module identifier.
		 */
		fetch: function (identifier) {
			return "";
		},

		/**
		 * Accepts a module text and returns a module factory function.
		 */
		evaluate: function (text) {
			return function (require, exports, system) {
			};
		},

		/**
		 * Accepts a module identifier (that may be a relative module identifier) and optionally a base 
		 * module identifier (that must be an absolute module identifier) and returns the corresponding 
		 * absolute identifier of the former. 
		 */
		resolve: function (identifier, base) {
			return identifier;
		},

		/**
		 * Accepts an absolute module identifier and returns that identifier in its canonical form. 
		 * "canonical" MAY be an identity relation. "canonical" may return an opaque reference object 
		 * to prevent information about the underlying file system from leaking into a sandbox. 
		 */
		normalize: function (identifier) {
		}
	};
}());
