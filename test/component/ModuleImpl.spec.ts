import { assertNullGuarded, NullTester } from 'test/TestUtils';
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
import CydranContextImpl from 'context/CydranContextImpl';
import CydranContext from 'context/CydranContext';
import PubSub from "message/PubSub";
import ComponentInternals from "component/ComponentInternals";
import { DEFAULT_MODULE_KEY } from "Constants";
import Scope from "scope/Scope";
class TestClass {
	private cnt: number = 0;

	public getCount(): number {
		return this.cnt;
	}

	public increment(): void {
		this.cnt++;
	}
}

const TEST: string = "test";
const FOO: string = "foo";
const INV_ID: string = "Invalid id!";

const scope: ScopeImpl = new ScopeImpl();

function dom(): Dom {
	return new DomImpl();
}

function cydranContext(): CydranContext {
	return new CydranContextImpl(dom());
}

function walker(): DomWalker {
	return new MvvmDomWalkerImpl(cydranContext());
}

function modulesContext(): ModulesContextImpl {
	return new ModulesContextImpl(cydranContext());
}

function properties(): MutableProperties {
	return new PropertiesImpl();
}

function module(): ModuleImpl {
	return new ModuleImpl(cydranContext(), walker(), TEST, modulesContext(), scope, properties());
}

const tester: NullTester = new NullTester()
	.addFactory("cydranContext", cydranContext)
	.addFactory("dom", dom)
	.addFactory("walker", walker)
	.addFactory("modules", modulesContext)
	.addFactory("scope", () => new ScopeImpl())
	.addFactory("properties", () => properties)
	.addFactory("id", () => "id")
	.addFactory("instance", () => FOO)
	.addFactory("classInstance", () => ModuleImpl)
	.addFactory("channelName", () => "channelName")
	.addFactory("messageName", () => "messageName")
	.addFactory("payload", () => FOO);


let testMod: Module = null;
beforeEach(() => {
	testMod = module();
});

afterEach(() => {
	testMod = null;
});

test("Constructor arguments", () => {
	tester.testConstructor(ModuleImpl, ["cydranContext", "walker", null, "modules", null, "properties"]);
});

test("message() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.message, ["channelName", "messageName", null]);
});

test("message() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModuleImpl(cydranContext(), walker(), TEST, modulesContext(), scope, properties()).message(TEST, TEST, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("get() - null id", () => {
	assertNullGuarded("id", () => testMod.get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.get(INV_ID), "ValidationError");
});

test("getLocal() - null id", () => {
	assertNullGuarded("id", () => testMod.getLocal(null));
});

test("getLocal() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.getLocal(INV_ID), "ValidationError");
});

test("addStrategy() - null strategy", () => {
	assertNullGuarded("strategy", () => testMod.addStrategy(null));
});

test("expose() - null id", () => {
	assertNullGuarded("id", () => testMod.expose(null));
});

test("expose() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.expose(INV_ID), "ValidationError");
});

test("broadcast() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.broadcast, ["channelName", "messageName", null]);
});

test("broadcast() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModuleImpl(cydranContext(), walker(), TEST, modulesContext(), scope, properties()).broadcast(TEST, TEST, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("associate() - null value", () => {
	assertNullGuarded("componentClass", () => testMod.associate(null));
});

test("disassociate() - null value", () => {
	assertNullGuarded("componentClass", () => testMod.disassociate(null));
});

test("registerConstant() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerConstant(INV_ID, "Foo"), "ValidationError");
});

test("registerConstant() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.registerConstant, ["id", "instance"]);
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerSingleton(INV_ID, TestClass, []), "ValidationError");
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.registerSingleton, ["id", "classInstance"]);
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.registerPrototype, ["id", "classInstance"]);
});

test("getLogger(): Logger", () => {
	const logr: Logger = testMod.getLogger();
	expect(logr).not.toBeNull();
	expect(logr).toBeInstanceOf(LoggerImpl);
});

test("getName(): string", () => {
	const name: string = testMod.getName();
	expect(name).not.toBeNull();
	expect(name).toEqual(TEST);
});

test("clear(): void", () => {
	const spyTestMod: Module = spy(testMod);
	testMod.clear();
	verify(spyTestMod.clear()).once();
});

test("logError(e: RegistrationError): void", () => {
	const testMod: Module = new ModuleImpl(cydranContext(), walker(), TEST, modulesContext(), scope, properties());
	const logr: Logger = testMod.getLogger();
	const spyLogr: Logger = spy(logr);
	const error: RegistrationError = new RegistrationError("test error");
	logr.error(error);
	verify(spyLogr.error(error));
});
