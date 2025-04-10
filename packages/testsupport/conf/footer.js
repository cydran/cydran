((root, factory, cydranObject) => {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['exports'], function(exports) {
			factory((root.commonJsStrictGlobal = exports), cydranObject);
		});
	} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
		// CommonJS
		factory(exports, cydranObject);
	} else {
		// Browser globals
		factory((root.commonJsStrictGlobal = {}), cydranObject);
	}
})(typeof self !== 'undefined' ? self : this, function(exports, c) {
	c.overlay(exports, [c]);
}, testsupport);
