import { assert } from "chai";
import { describe, it, xit } from "mocha";
import CydranConfig from "../src/CydranConfig";

describe("CydranConfig tests", () => {

	it("new CydranConfig()", () => {
		const instance: CydranConfig = new CydranConfig();
		assert.isNotNull(instance, "is null");
	});

});
