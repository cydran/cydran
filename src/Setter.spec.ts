import Setter from "@/Setter";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, verify, when } from "ts-mockito";

describe("Setter tests", () => {

	it("new Setter(expression)", () => {
		const testInstance = new Setter("x = 1");
		assert.isNotNull(testInstance, "is null");
	});

	it.skip("set(scope, value)", () => {
		//
	});

});
