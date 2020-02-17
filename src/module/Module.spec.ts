import ScopeImpl from "@/model/ScopeImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { ModuleImpl } from "@/module/Modules";

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

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl("test", scope).get("Invalid id!"), "ValidationError");
	});

	it("getLocal() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).getLocal(null));
	});

	it("getLocal() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl("test", scope).getLocal("Invalid id!"), "ValidationError");
	});

	it("addStrategy() - null strategy", () => {
		assertNullGuarded("strategy", () => new ModuleImpl("test", scope).addStrategy(null));
	});

	it("expose() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).expose(null));
	});

	it("expose() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl("test", scope).expose("Invalid id!"), "ValidationError");
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

	it("registerConstant() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl("test", scope).registerConstant("Invalid id!", "Foo"), "ValidationError");
	});

	it("registerConstant() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).registerConstant(null, "Foo"));
	});

	it("registerConstant() - null instance", () => {
		assertNullGuarded("instance", () => new ModuleImpl("test", scope).registerConstant("foo", null));
	});

	it("registerSingleton() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl("test", scope).registerSingleton("Invalid id!", function() {
			// Intentionally do nothing
		}, []), "ValidationError");
	});

	it("registerSingleton() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).registerSingleton(null, function() {
			// Intentionally do nothing
		}, []));
	});

	it("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => new ModuleImpl("test", scope).registerSingleton("foo", null, []));
	});

	it("registerPrototype() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl("test", scope).registerPrototype("Invalid id!", function() {
			// Intentionally do nothing
		}, []), "ValidationError");
	});

	it("registerPrototype() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl("test", scope).registerPrototype(null, function() {
			// Intentionally do nothing
		}, []));
	});

	it("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => new ModuleImpl("test", scope).registerPrototype("foo", null, []));
	});

});
