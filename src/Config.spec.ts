import { assert } from "chai";
import { describe, it, xit } from "mocha";
import Config from "./Config";

describe("Config tests", () => {

	it("new Config()", () => {
		const instance: Config = new Config();
		assert.isNotNull(instance, "is null");
	});

});
