import RegistrationError from "@/error/RegistrationError";
import Logger from "@/logger/Logger";
import LoggerImpl from "@/logger/LoggerImpl";
import Module from "@/module/Module";
import { ModuleImpl } from "@/module/Modules";
import ScopeImpl from "@/model/ScopeImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { mock, spy, verify } from "ts-mockito";

describe("Module tests", () => {
	const BAZ: string = "bazzooka";
	const HAND: string = "handler";
	const VAL: string = "value";

	function getContext() {
		return {
			handler: function(payload: any) {
				this[VAL] = payload;
			},
			value: "bat"
		};
	}

	const TEST: string = "test";
	const FOO: string = "foo";
	const INV_ID: string = "Invalid id!";

	const scope: ScopeImpl = new ScopeImpl();

	it("message() - null channelName", () => {
		assertNullGuarded("channelName", () => new ModuleImpl(TEST, scope).message(null, TEST, {}));
	});

	it("message() - null messageName", () => {
		assertNullGuarded("messageName", () => new ModuleImpl(TEST, scope).message(TEST, null, {}));
	});

	it("message() - null payload", () => {
		let thrown: Error = null;

		try {
			new ModuleImpl(TEST, scope).message(TEST, TEST, null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl(TEST, scope).get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, scope).get(INV_ID), "ValidationError");
	});

	it("getLocal() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl(TEST, scope).getLocal(null));
	});

	it("getLocal() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, scope).getLocal(INV_ID), "ValidationError");
	});

	it("addStrategy() - null strategy", () => {
		assertNullGuarded("strategy", () => new ModuleImpl(TEST, scope).addStrategy(null));
	});

	it("expose() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl(TEST, scope).expose(null));
	});

	it("expose() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, scope).expose(INV_ID), "ValidationError");
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => new ModuleImpl(TEST, scope).broadcast(null, TEST, {}));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded("messageName", () => new ModuleImpl(TEST, scope).broadcast(TEST, null, {}));
	});

	it("broadcast() - null payload", () => {
		let thrown: Error = null;

		try {
			new ModuleImpl(TEST, scope).broadcast(TEST, TEST, null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("associate() - null value", () => {
		assertNullGuarded("componentClass", () => new ModuleImpl(TEST, scope).associate(null));
	});

	it("disassociate() - null value", () => {
		assertNullGuarded("componentClass", () => new ModuleImpl(TEST, scope).disassociate(null));
	});

	it("registerConstant() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, scope).registerConstant(INV_ID, "Foo"), "ValidationError");
	});

	it("registerConstant() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl(TEST, scope).registerConstant(null, FOO));
	});

	it("registerConstant() - null instance", () => {
		assertNullGuarded("instance", () => new ModuleImpl(TEST, scope).registerConstant(FOO, null));
	});

	it("registerSingleton() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, scope).registerSingleton(INV_ID, function() {
			// Intentionally do nothing
		}, []), "ValidationError");
	});

	it("registerSingleton() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl(TEST, scope).registerSingleton(null, function() {
			// Intentionally do nothing
		}, []));
	});

	it("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => new ModuleImpl(TEST, scope).registerSingleton(FOO, null, []));
	});

	it("registerPrototype() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, scope).registerPrototype(INV_ID, function() {
			// Intentionally do nothing
		}, []), "ValidationError");
	});

	it("registerPrototype() - null id", () => {
		assertNullGuarded("id", () => new ModuleImpl(TEST, scope).registerPrototype(null, function() {
			// Intentionally do nothing
		}, []));
	});

	it("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => new ModuleImpl(TEST, scope).registerPrototype(FOO, null, []));
	});

	it("getLogger(): Logger", () => {
		const testMod: Module = new ModuleImpl(TEST, scope);
		const logr: Logger = testMod.getLogger();
		assert.isNotNull(logr);
		assert.instanceOf(logr, LoggerImpl, "is instance of Logger");
	});

	it("getName(): string", () => {
		const testMod: Module = new ModuleImpl(TEST, scope);
		const name: string = testMod.getName();
		assert.isNotNull(name);
		assert.equal(TEST, name);
	});

	it("clear(): void", () => {
		const testMod: Module = new ModuleImpl(TEST, scope);
		const spyTestMod: Module = spy(testMod);
		testMod.clear();
		verify(spyTestMod.clear()).once();
	});

	it("logError(e: RegistrationError): void", () => {
		const testMod: Module = new ModuleImpl(TEST, scope);
		const logr: Logger = testMod.getLogger();
		const spyLogr: Logger = spy(logr);
		const error: RegistrationError = new RegistrationError("test error");
		logr.error(error);
		verify(spyLogr.error(error));
	});

});
