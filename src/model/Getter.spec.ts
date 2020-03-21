import Getter from "@/model/Getter";
import ScopeImpl from "@/model/ScopeImpl";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { mock, spy, verify } from "ts-mockito";

describe("Getter tests", () => {

	it("new Getter(expression)", () => {
		const specimen = new Getter("x = 1");
		assert.isNotNull(specimen, "is null");
	});

	it("set(scope)", () => {
		const specimen = new Getter("x = 1");
		const scope = new ScopeImpl();
		scope.add("var1", "Bubba");
		const spySetter: Getter<any> = spy(specimen);
		specimen.get(scope);
		verify(spySetter.get(scope)).once();
		expect(() => specimen.get(new ScopeImpl())).to.not.throw();
	});

});
