import vm from "vm";
import { createUmdHeader, createUmdFooter } from "../../src/build/UmdWrapper.js";

/**
 * A stand-in for esbuild's CommonJS output: requires its one dependency and replaces module.exports.
 */
const MODULE_BODY: string = [
	"var dependency = require(\"@cydran/cydran\");",
	"module.exports = { marker: dependency.marker };"
].join("\n");

const SOURCE: string = [createUmdHeader("stub", ["@cydran/cydran"], { "@cydran/cydran": "cydran", "unused": "unused" }), MODULE_BODY, createUmdFooter()].join("\n");

function createContext(): any {
	const context: any = {};
	context.self = context;

	return context;
}

describe("UmdWrapper", () => {
	test("global path reads a dependency from its configured global", () => {
		const context: any = createContext();
		context.cydran = { marker: "from the global" };

		vm.runInNewContext(SOURCE, context);

		expect(context.stub.marker).toEqual("from the global");
	});

	test("global path fails naming a dependency whose configured global is not loaded", () => {
		const context: any = createContext();

		expect(() => vm.runInNewContext(SOURCE, context)).toThrow("stub: dependency @cydran/cydran is not available as a global");
		expect(context.stub).toBeUndefined();
	});

	test("global path fails naming a dependency without a configured global", () => {
		const context: any = createContext();
		const source: string = [createUmdHeader("stub", ["@cydran/cydran"], {}), MODULE_BODY, createUmdFooter()].join("\n");
		context.cydran = { marker: "never read" };

		expect(() => vm.runInNewContext(source, context)).toThrow("stub: dependency @cydran/cydran is not available as a global");
	});

	test("AMD path lists only the used dependencies and passes them to the module", () => {
		const context: any = createContext();
		const exports: any = {};
		let dependencies: string[] = null;
		context.define = (deps: string[], factory: Function) => {
			dependencies = deps;
			factory(exports, { marker: "from AMD" });
		};
		context.define.amd = true;

		vm.runInNewContext(SOURCE, context);

		expect(dependencies).toEqual(["exports", "@cydran/cydran"]);
		expect(exports.marker).toEqual("from AMD");
		expect(context.stub).toBeUndefined();
	});

	test("CommonJS path uses require", () => {
		const context: any = createContext();
		context.exports = {};
		context.require = (id: string) => ({ marker: "required " + id });

		vm.runInNewContext(SOURCE, context);

		expect(context.exports.marker).toEqual("required @cydran/cydran");
	});

	test("CommonJS path without require fails naming the dependency", () => {
		const context: any = createContext();
		context.exports = {};

		expect(() => vm.runInNewContext(SOURCE, context)).toThrow("stub: dependency @cydran/cydran cannot be loaded: require is not available");
	});

	test("only the globals of used dependencies are written", () => {
		expect(SOURCE).toContain("var globals = {\"@cydran/cydran\":\"cydran\"};");
	});
});
