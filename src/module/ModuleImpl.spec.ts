import RegistrationError from "@/error/RegistrationError";
import Logger from "@/logger/Logger";
import LoggerImpl from "@/logger/LoggerImpl";
import Module from "@/module/Module";
import ModuleImpl from "@/module/ModuleImpl";
import ScopeImpl from "@/model/ScopeImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { mock, spy, verify } from "ts-mockito";
import ModulesContextImpl from "@/module/ModulesContextImpl";

class TestClass {
	// Intentionally empty
}

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

test("message() - null channelName", () => {
	assertNullGuarded("channelName", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).message(null, TEST, {}));
});

test("message() - null messageName", () => {
	assertNullGuarded("messageName", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).message(TEST, null, {}));
});

test("message() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModuleImpl(TEST, new ModulesContextImpl(), scope).message(TEST, TEST, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("get() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).get(INV_ID),
		"ValidationError");
});

test("getLocal() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).getLocal(null));
});

test("getLocal() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).getLocal(INV_ID),
		"ValidationError");
});

test("addStrategy() - null strategy", () => {
	assertNullGuarded("strategy", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).addStrategy(null));
});

test("expose() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).expose(null));
});

test("expose() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).expose(INV_ID),
		"ValidationError");
});

test("broadcast() - null channelName", () => {
	assertNullGuarded("channelName", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).broadcast(null, TEST, {}));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded("messageName", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).broadcast(TEST, null, {}));
});

test("broadcast() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModuleImpl(TEST, new ModulesContextImpl(), scope).broadcast(TEST, TEST, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("associate() - null value", () => {
	assertNullGuarded("componentClass", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).associate(null));
});

test("disassociate() - null value", () => {
	assertNullGuarded("componentClass", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).disassociate(null));
});

test("registerConstant() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, new ModulesContextImpl(),
		scope).registerConstant(INV_ID, "Foo"), "ValidationError");
});

test("registerConstant() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerConstant(null, FOO));
});

test("registerConstant() - null instance", () => {
	assertNullGuarded("instance", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerConstant(FOO, null));
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerSingleton(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerSingleton() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerSingleton(null, TestClass, []));
});

test("registerSingleton() - null classInstance", () => {
	assertNullGuarded("classInstance", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerSingleton(FOO, null, []));
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope).registerPrototype(null, TestClass, []));
});

test("registerPrototype() - null classInstance", () => {
	assertNullGuarded("classInstance", () => new ModuleImpl(TEST, new ModulesContextImpl(), scope)
		.registerPrototype(FOO, null, []));
});

test("getLogger(): Logger", () => {
	const testMod: Module = new ModuleImpl(TEST, new ModulesContextImpl(), scope);
	const logr: Logger = testMod.getLogger();
	expect(logr).not.toBeNull();
	expect(logr).toBeInstanceOf(LoggerImpl);
});

test("getName(): string", () => {
	const testMod: Module = new ModuleImpl(TEST, new ModulesContextImpl(), scope);
	const name: string = testMod.getName();
	expect(name).not.toBeNull();
	expect(name).toEqual(TEST);
});

test("clear(): void", () => {
	const testMod: Module = new ModuleImpl(TEST, new ModulesContextImpl(), scope);
	const spyTestMod: Module = spy(testMod);
	testMod.clear();
	verify(spyTestMod.clear()).once();
});

test("logError(e: RegistrationError): void", () => {
	const testMod: Module = new ModuleImpl(TEST, new ModulesContextImpl(), scope);
	const logr: Logger = testMod.getLogger();
	const spyLogr: Logger = spy(logr);
	const error: RegistrationError = new RegistrationError("test error");
	logr.error(error);
	verify(spyLogr.error(error));
});
