import Invoker from "@/model/Invoker";
import ScopeImpl from "@/model/ScopeImpl";
import { assert } from "chai";
import { describe, it } from "mocha";
import { spy, verify } from "ts-mockito";

describe("Invoker tests", () => {

	it("Constructor - Normal Instantation", () => {
		const instance: Invoker = new Invoker("true");
		assert.isNotNull(instance, "is null");
	});

	it("invoike() called", () => {
		const instance: Invoker = new Invoker("true");
		const spyInstance: Invoker = spy(instance);
		const scope: ScopeImpl = new ScopeImpl();
		const params = {};
		instance.invoke(scope, params);
		verify(spyInstance.invoke(scope, params)).once();
	});

});
