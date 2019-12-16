import { assert } from "chai";
import { describe, it, xit } from "mocha";
import CydranConfig from "./CydranConfig";

describe("CydranConfig tests", () => {

	it("new CydranConfig()", () => {
		const instance: CydranConfig = new CydranConfig();
		assert.isNotNull(instance, "is null");
	});

});
