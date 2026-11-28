/**
 * The text esbuild places before and after its CommonJS output to make the UMD bundle <dist>/<name>.js:
 *
 * - When an AMD define with define.amd is present, an anonymous AMD module with the dependencies "exports" plus ids.
 * - Otherwise, when a CommonJS exports object is present, the module fills it, using the CommonJS require. Without a
 *   require, loading a dependency throws an error naming it.
 * - Otherwise the module runs into a new object, which is then assigned to the global <name>. Assigning it only after the
 *   module has run lets the module read the previous value while it loads (noConflict). Each dependency is read from
 *   the global globals[id], and a missing one throws an error naming the dependency.
 *
 * The module body is esbuild's cjs output, which requires its dependencies and replaces module.exports. The footer
 * copies the resulting properties, with their getters, onto the exports object of the loader.
 */
function createUmdHeader(name: string, ids: string[], globals: Record<string, string>): string {
	const usedGlobals: Record<string, string> = {};

	for (const id of ids) {
		if (Object.prototype.hasOwnProperty.call(globals, id)) {
			usedGlobals[id] = globals[id];
		}
	}

	const missingMessage: string = JSON.stringify(`${name}: dependency `);

	return [
		"(function (root, factory) {",
		`\tvar ids = ${JSON.stringify(ids)};`,
		`\tvar globals = ${JSON.stringify(usedGlobals)};`,
		"\tif (typeof define === \"function\" && define.amd) {",
		"\t\tdefine([\"exports\"].concat(ids), function (exports) {",
		"\t\t\tvar values = Array.prototype.slice.call(arguments, 1);",
		"\t\t\tfactory(exports, function (id) {",
		"\t\t\t\treturn values[ids.indexOf(id)];",
		"\t\t\t});",
		"\t\t});",
		"\t} else if (typeof exports === \"object\" && typeof exports.nodeName !== \"string\") {",
		"\t\tfactory(exports, typeof require === \"function\" ? require : function (id) {",
		`\t\t\tthrow new Error(${missingMessage} + id + " cannot be loaded: require is not available");`,
		"\t\t});",
		"\t} else {",
		"\t\tvar target = {};",
		"\t\tfactory(target, function (id) {",
		"\t\t\tvar value = Object.prototype.hasOwnProperty.call(globals, id) ? root[globals[id]] : undefined;",
		"\t\t\tif (value === undefined) {",
		`\t\t\t\tthrow new Error(${missingMessage} + id + " is not available as a global");`,
		"\t\t\t}",
		"\t\t\treturn value;",
		"\t\t});",
		`\t\troot[${JSON.stringify(name)}] = target;`,
		"\t}",
		"})(typeof self !== \"undefined\" ? self : this, function (exports, require) {",
		"\"use strict\";",
		"var module = { exports: {} };"
	].join("\n");
}

function createUmdFooter(): string {
	return [
		"var source = module.exports;",
		"Object.getOwnPropertyNames(source).forEach(function (key) {",
		"\tObject.defineProperty(exports, key, Object.getOwnPropertyDescriptor(source, key));",
		"});",
		"});"
	].join("\n");
}

export { createUmdHeader, createUmdFooter };
