import ModelMediatorImpl from "@/model/ModelMediatorImpl";
import ScopeImpl from "@/model/ScopeImpl";
import Mvvm from "@/mvvm/Mvvm";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it } from "mocha";
import { spy } from "ts-mockito";

describe("ModelMediatorImpl tests", () => {

	const mvvmStub: Mvvm = {
		init: null,
		nestingChanged: null,
		dispose: null,
		getId: null,
		mediate: null,
		digest: null,
		$apply: null,
		getModelFn: null,
		getItemFn: null,
		getExternalFn: null,
		getParent: null,
		requestMediators: null,
		requestMediatorSources: null,
		skipId: null
	};

	it("Constructor - Normal Instantation", () => {
		const expression: string = "let x = 1";
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		const instance: ModelMediatorImpl<string> = new ModelMediatorImpl({}, expression, spyScope, mvvmStub);
		assert.isNotNull(instance, "is null");
	});

	it("Constructor - null model", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("model", () => new ModelMediatorImpl(null, "expression", spyScope, mvvmStub));
	});

	it("Constructor - null expression", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("expression", () => new ModelMediatorImpl({}, null, spyScope, mvvmStub));
	});

	it("Constructor - null scope", () => {
		assertNullGuarded("scope", () => new ModelMediatorImpl({}, "expression", null, mvvmStub));
	});

	it("watch() - null context", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("context", () => new ModelMediatorImpl({}, "expression", spyScope, mvvmStub).watch(null, () => {
			// Intentionally do nothing
		}));
	});

	it("watch() - null target", () => {
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		assertNullGuarded("target", () => new ModelMediatorImpl({}, "expression", spyScope, mvvmStub).watch({}, null));
	});

});
