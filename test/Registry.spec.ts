import { assert } from "chai";
import { describe, it } from "mocha";
import { Registry, RegistryImpl } from "../src/Registry";

describe("Registry tests", () => {

	it("new RegistryImpl()", () => {
		const r: Registry = new RegistryImpl();
		assert.isNotNull(r, "is null");
	});

});
