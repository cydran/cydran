import ModelMediatorImpl from "@/ModelMediatorImpl";
import ScopeImpl from "@/ScopeImpl";
import { assertNullGuarded } from "@/TestUtils";
import { assert } from "chai";
import { describe, it } from "mocha";
import { spy } from "ts-mockito";

describe("ModelMediatorImpl tests", () => {

	it("Constructor - Normal Instantation", () => {
		const expression: string = "let x = 1";
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		const instance: ModelMediatorImpl<string> = new ModelMediatorImpl({}, expression, spyScope);
		assert.isNotNull(instance, "is null");
	});

	it("Constructor - null model", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("model", () => new ModelMediatorImpl(null, "expression", spyScope));
	});

	it("Constructor - null expression", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("expression", () => new ModelMediatorImpl({}, null, spyScope));
	});

	it("Constructor - null scope", () => {
		assertNullGuarded("scope", () => new ModelMediatorImpl({}, "expression", null));
	});

	it("watch() - null context", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("context", () => new ModelMediatorImpl({}, "expression", spyScope).watch(null, () => {
			// Intentionally do nothing
		}));
	});

	it("watch() - null target", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("target", () => new ModelMediatorImpl({}, "expression", spyScope).watch({}, null));
	});

});
