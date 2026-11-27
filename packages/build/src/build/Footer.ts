import { requireNotNull } from "../Utils.js";

/**
 * The text esbuild appends to the iife bundle. It copies the bundle's global onto AMD's exports or CommonJS exports.
 * The text is the conf/footer.js the library packages used to carry, with the bundle's global as the last argument.
 */
function createFooter(name: string): string {
	requireNotNull(name, "name");

	return "((root, factory, cydranObject) => {\n"
		+ "\tif (typeof define === 'function' && define.amd) {\n"
		+ "\t\t// AMD. Register as an anonymous module.\n"
		+ "\t\tdefine(['exports'], function(exports) {\n"
		+ "\t\t\tfactory((root.commonJsStrictGlobal = exports), cydranObject);\n"
		+ "\t\t});\n"
		+ "\t} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {\n"
		+ "\t\t// CommonJS\n"
		+ "\t\tfactory(exports, cydranObject);\n"
		+ "\t} else {\n"
		+ "\t\t// Browser globals\n"
		+ "\t\tfactory((root.commonJsStrictGlobal = {}), cydranObject);\n"
		+ "\t}\n"
		+ "})(typeof self !== 'undefined' ? self : this, function(exports, c) {\n"
		+ "\tc.overlay(exports, [c]);\n"
		+ `}, ${name});\n`;
}

export { createFooter };
