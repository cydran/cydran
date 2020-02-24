import IdGenerator from "@/pattern/IdGenerator";
import { assert } from "chai";
import { describe, it, xit } from "mocha";

describe("IdGenerator tests", () => {

	it("codes generated", () => {
		const instance: IdGenerator = new IdGenerator();
		assert.equal(instance.generate(), "0-0-0");
		assert.equal(instance.generate(), "0-0-1");
		assert.equal(instance.generate(), "0-0-2");
		assert.equal(instance.generate(), "0-0-3");
		assert.equal(instance.generate(), "0-0-4");
		assert.equal(instance.generate(), "0-0-5");
	});

});
