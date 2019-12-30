import ModelMediatorImpl from "@/ModelMediatorImpl";
import ScopeImpl from "@/ScopeImpl";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { mock, spy, verify, when } from "ts-mockito";

describe("ModelMediatorImpl tests", () => {

	it("new ModelMediatorImpl<T>", () => {
		const expression: string = "let x = 1";
		const spyScope: ScopeImpl = spy(new ScopeImpl());
		const instance: ModelMediatorImpl<string> = new ModelMediatorImpl({}, expression, spyScope);
		assert.isNotNull(instance, "is null");
	});

});
