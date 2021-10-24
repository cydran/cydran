import { assertNullGuarded } from "test/TestUtils";
import { mock, spy, verify } from "ts-mockito";
import { MutableProperties } from 'interface/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ScopeImpl from 'scope/ScopeImpl';
import ModuleImpl from 'module/ModuleImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import Module from 'module/Module';
import Logger from 'log/Logger';
import { RegistrationError } from 'error/Errors';
import LoggerImpl from 'log/LoggerImpl';
import DomImpl from 'dom/DomImpl';
import Dom from 'dom/Dom';
import DomWalker from 'component/DomWalker';
import MvvmDomWalkerImpl from 'component/MvvmDomWalkerImpl';
class TestClass {
	// Intentionally empty
}

const TEST: string = "test";
const FOO: string = "foo";
const INV_ID: string = "Invalid id!";

const scope: ScopeImpl = new ScopeImpl();

function dom(): Dom {
	return new DomImpl();
}

function walker(): DomWalker {
	return new MvvmDomWalkerImpl(dom());
}

function modulesContext(): ModulesContextImpl {
	return new ModulesContextImpl(dom());
}

function properties(): MutableProperties {
	return new PropertiesImpl();
}

test("message() - null channelName", () => {
	assertNullGuarded("channelName", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).message(null, TEST, {}));
});

test("message() - null messageName", () => {
	assertNullGuarded("messageName", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).message(TEST, null, {}));
});

test("message() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).message(TEST, TEST, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("get() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).get(INV_ID),
		"ValidationError");
});

test("getLocal() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).getLocal(null));
});

test("getLocal() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).getLocal(INV_ID),
		"ValidationError");
});

test("addStrategy() - null strategy", () => {
	assertNullGuarded("strategy", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).addStrategy(null));
});

test("expose() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).expose(null));
});

test("expose() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).expose(INV_ID),
		"ValidationError");
});

test("broadcast() - null channelName", () => {
	assertNullGuarded("channelName", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).broadcast(null, TEST, {}));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded("messageName", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).broadcast(TEST, null, {}));
});

test("broadcast() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).broadcast(TEST, TEST, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("associate() - null value", () => {
	assertNullGuarded("componentClass", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).associate(null));
});

test("disassociate() - null value", () => {
	assertNullGuarded("componentClass", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).disassociate(null));
});

test("registerConstant() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(),
		scope, properties()).registerConstant(INV_ID, "Foo"), "ValidationError");
});

test("registerConstant() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerConstant(null, FOO));
});

test("registerConstant() - null instance", () => {
	assertNullGuarded("instance", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerConstant(FOO, null));
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerSingleton(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerSingleton() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerSingleton(null, TestClass, []));
});

test("registerSingleton() - null classInstance", () => {
	assertNullGuarded("classInstance", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerSingleton(FOO, null, []));
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - null id", () => {
	assertNullGuarded("id", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties()).registerPrototype(null, TestClass, []));
});

test("registerPrototype() - null classInstance", () => {
	assertNullGuarded("classInstance", () => new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties())
		.registerPrototype(FOO, null, []));
});

test("getLogger(): Logger", () => {
	const testMod: Module = new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties());
	const logr: Logger = testMod.getLogger();
	expect(logr).not.toBeNull();
	expect(logr).toBeInstanceOf(LoggerImpl);
});

test("getName(): string", () => {
	const testMod: Module = new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties());
	const name: string = testMod.getName();
	expect(name).not.toBeNull();
	expect(name).toEqual(TEST);
});

test("clear(): void", () => {
	const testMod: Module = new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties());
	const spyTestMod: Module = spy(testMod);
	testMod.clear();
	verify(spyTestMod.clear()).once();
});

test("logError(e: RegistrationError): void", () => {
	const testMod: Module = new ModuleImpl(dom(), walker(), TEST, modulesContext(), scope, properties());
	const logr: Logger = testMod.getLogger();
	const spyLogr: Logger = spy(logr);
	const error: RegistrationError = new RegistrationError("test error");
	logr.error(error);
	verify(spyLogr.error(error));
});
