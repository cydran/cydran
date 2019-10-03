import {assert} from "chai";
import {describe, it} from "mocha";
import {Registry, RegistryImpl} from "./Registry";

describe("Registry", () => {

	it("is instantiated without errors", () => {
		const r: Registry = new RegistryImpl();
		assert.isNotNull(r);
	});

});
