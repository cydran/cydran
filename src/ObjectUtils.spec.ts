import {assert} from "chai";
import {describe, it} from "mocha";
import ObjectUtils from "./ObjectUtils";

describe("ObjectUtils tests", () => {

	it("it works", () => {
		assert.isTrue(ObjectUtils.deepEquals(1, 1));
		assert.isNotNull({}, "is null");
	});

});
