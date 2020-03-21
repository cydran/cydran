import ExternalMediator from "@/model/ExternalMediator";
import ScopeImpl from "@/model/ScopeImpl";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { spy, verify } from "ts-mockito";

describe("ExternalMediator tests", () => {
	const exp: string = "x = 1";

	it("new ExternalMediator(expression)", () => {
		const specimen = new ExternalMediator(exp);
		assert.isNotNull(specimen, "is null");
	});

	it("set(scope: ScopeImpl, value: T): void", () => {
		const specimen = new ExternalMediator(exp);
		const scope = new ScopeImpl();
		const val = "xyz";
		const spyExternalMediator: ExternalMediator<any> = spy(specimen);
		specimen.set(scope, val);
		verify(spyExternalMediator.set(scope, val)).once();
		expect(() => specimen.get(new ScopeImpl())).to.not.throw();
	});

	it("get(scope: ScopeImpl, value: T): void", () => {
		const specimen = new ExternalMediator(exp);
		const scope = new ScopeImpl();
		const val = "xyz";
		const spyExternalMediator: ExternalMediator<any> = spy(specimen);
		specimen.set(scope, val);
		verify(spyExternalMediator.set(scope, val)).once();
		const result = specimen.get(scope);
		assert.isNull(result);
		verify(spyExternalMediator.get(scope)).once();
	});

});
