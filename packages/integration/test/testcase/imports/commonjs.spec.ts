/**
 * @jest-environment jsdom
 */
 import * as fs from "fs";

test("Cydran should be defined and populated when used as a CommonJS module", () => {
	const exports: any = {};
	const fnPrefix = "var exports = arguments[0];\n";
	Function(fnPrefix + fs.readFileSync("../cydran/dist/cydran.js", "utf8"))(exports);

	expect(exports).not.toBeNull();
	expect(exports["Component"]).toBeDefined();
});
