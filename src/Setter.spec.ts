import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, verify, when } from "ts-mockito";
import Setter from "@/Setter";

describe("Setter tests", () => {

	it("new Setter(expression)", () => {
		const instance = new Setter("x = 1");
		assert.isNotNull(instance, "is null");
	});

	it.skip("set(scope, value)", () => {
		//
	});

});
