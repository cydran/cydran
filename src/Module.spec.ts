import { ModuleImpl } from "@/Core";
import ScopeImpl from "@/ScopeImpl";
import { assertNullGuarded } from "@/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";

describe("Module tests", () => {

	const scope: ScopeImpl = new ScopeImpl();

	it("message() - null channelName", () => {
		assertNullGuarded("channelName", () => new ModuleImpl("test", scope).message(null, "test", {}));
	});

	it("message() - null messageName", () => {
		assertNullGuarded("messageName", () => new ModuleImpl("test", scope).message("test", null, {}));
	});

	it("message() - null payload", () => {
		let thrown: Error = null;

		try {
			new ModuleImpl("test", scope).message("test", "test", null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).get(null));
	});

	it("getLocal() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).getLocal(null));
	});

	it("addStrategy() - null strategy", () => {
		assertNullGuarded("strategy", () => new ModuleImpl("test", scope).addStrategy(null));
	});

	it("expose() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).expose(null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => new ModuleImpl("test", scope).broadcast(null, "test", {}));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded("messageName", () => new ModuleImpl("test", scope).broadcast("test", null, {}));
	});

	it("broadcast() - null payload", () => {
		let thrown: Error = null;

		try {
			new ModuleImpl("test", scope).broadcast("test", "test", null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("associate() - null value", () => {
		assertNullGuarded("componentClass", () => new ModuleImpl("test", scope).associate(null));
	});

	it("disassociate() - null value", () => {
		assertNullGuarded("componentClass", () => new ModuleImpl("test", scope).disassociate(null));
	});

});
