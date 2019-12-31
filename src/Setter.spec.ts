import ScopeImpl from "@/ScopeImpl";
import Setter from "@/Setter";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { mock, spy, verify } from "ts-mockito";

describe("Setter tests", () => {

	it("new Setter(expression)", () => {
		const testInstance = new Setter("x = 1");
		assert.isNotNull(testInstance, "is null");
	});

	it("set(scope, value)", () => {
		const testInstance = new Setter("x = 1");
		const spyScope = spy(new ScopeImpl());
		const spySetter: Setter<any> = spy(testInstance);
		testInstance.set(spyScope, "bubba");
		verify(spySetter.set(spyScope, "bubba")).once();
		expect(() => testInstance.set(new ScopeImpl(), "bubba")).to.not.throw();
	});

});
