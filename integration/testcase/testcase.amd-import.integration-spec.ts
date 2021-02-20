import * as fs from "fs";

test("Cydran should be defined and populated", () => {
	const exports: any = {};

	const define: Function = function(deps: any[], callback: Function) {
		callback(exports);
	};

	define["amd"] = true;
	const fnPrefix = "var define = arguments[0];\n";
	Function(fnPrefix + fs.readFileSync("./dist/cydran.js", "utf8"))(define);

	expect(exports).not.toBeNull();
	expect(exports["Component"]).toBeDefined();
});
