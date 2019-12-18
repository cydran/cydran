import { assert } from "chai";
import { describe, it } from "mocha";
import SequenceGenerator from "../src/SequenceGenerator";

describe("SequenceGenerator tests", () => {

	it("ascending numbers should be supplied", () => {
		const value0: number = SequenceGenerator.INSTANCE.next();
		const value1: number = SequenceGenerator.INSTANCE.next();
		const value2: number = SequenceGenerator.INSTANCE.next();
		const value3: number = SequenceGenerator.INSTANCE.next();
		const value4: number = SequenceGenerator.INSTANCE.next();

		assert.isTrue(value0 < value1);
		assert.isTrue(value1 < value2);
		assert.isTrue(value2 < value3);
		assert.isTrue(value3 < value4);
	});

});
