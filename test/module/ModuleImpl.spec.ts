import { assertNullGuarded, NullTester } from 'test/TestUtils';
import { MutableProperties } from 'interface/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ScopeImpl from 'scope/ScopeImpl';
import ModuleImpl from 'module/ModuleImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import Module from 'module/Module';
import Logger from 'log/Logger';
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
import { mock, when } from "ts-mockito";
import ListenerImpl from "message/ListenerImpl";
import RegistryStrategy from "registry/RegistryStrategy";
import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";

class TestClass {
	private cnt: number = 0;

	public getCount(): number {
		return this.cnt;
	}

	public increment(): void {
		this.cnt++;
	}
}

class TestComponent extends Component {
	constructor(template: string, options: ComponentOptions = {}) {
		super(template, options);
	}
}

const TEST: string = "test";
const FOO: string = "foo";
const INV_ID: string = "Invalid id!";
const ID: string = "id";

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
	.addFactory(ID, () => ID)
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
	expect(() => testMod.message(TEST, TEST, null)).not.toThrowError();
});

test("get() - null id", () => {
	assertNullGuarded(ID, () => testMod.get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.get(INV_ID), "ValidationError");
});

test("getLocal() - null id", () => {
	assertNullGuarded(ID, () => testMod.getLocal(null));
});

test("getLocal() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.getLocal(INV_ID), "ValidationError");
});

test("addStrategy() - null strategy", () => {
	assertNullGuarded("strategy", () => testMod.addStrategy(null));
});

test("addStrategy() - good", () => {
	const wkSpy = jest.spyOn(testMod, 'addStrategy');
	const mockStrat: RegistryStrategy = mock(RegistryStrategy);
	testMod.addStrategy(mockStrat);
	expect(wkSpy).toBeCalledTimes(1);
});

test("expose() - null id", () => {
	assertNullGuarded(ID, () => testMod.expose(null));
});

test("expose() - good", () => {
	const wkSpy = jest.spyOn(testMod, 'expose');
	testMod.expose(TEST);
	expect(wkSpy).toBeCalledTimes(1);
});

test("expose() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.expose(INV_ID), "ValidationError");
});

test("broadcast() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.broadcast, ["channelName", "messageName", null]);
});

test("broadcast() - null payload", () => {
	expect(() => testMod.broadcast(TEST, TEST, null)).not.toThrowError();
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
	tester.testMethod(testMod, ModuleImpl.prototype.registerConstant, [ID, "instance"]);
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerSingleton(INV_ID, TestClass, []), "ValidationError");
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.registerSingleton, [ID, "classInstance"]);
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(testMod, ModuleImpl.prototype.registerPrototype, [ID, "classInstance"]);
});

test("registerPrototypeWithFactory() - good", () => {
	const wkSpy = jest.spyOn(testMod, 'registerPrototypeWithFactory');
	testMod.registerPrototypeWithFactory(ID, ()=> { return "<div></div>"; }, []);
	expect(wkSpy).toBeCalledTimes(1);
});

test("registerSingletonWithFactory() - good", () => {
	const wkSpy = jest.spyOn(testMod, 'registerSingletonWithFactory');
	testMod.registerSingletonWithFactory(ID, ()=> { return "<div></div>"; }, []);
	expect(wkSpy).toBeCalledTimes(1);
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
	const spyTestMod: Module = jest.spyOn(testMod, 'clear');
	testMod.clear();
	expect(spyTestMod).toBeCalledTimes(1);
});

test("hasRegistration", () => {
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	testMod.registerConstant(wkKey, wkConst);
	const wkSpy = jest.spyOn(testMod, 'hasRegistration');
	expect(testMod.hasRegistration("bubba")).toBe(false);
	expect(wkSpy).toBeCalledTimes(1);
	expect(testMod.hasRegistration(wkKey)).toBe(true);
});

test("$dispose", () => {
	const wkSpy = jest.spyOn(testMod, '$dispose');
	const props: MutableProperties = testMod.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getProperties", () => {
	const wkSpy = jest.spyOn(testMod, 'getProperties');
	const props: MutableProperties = testMod.getProperties();
	expect(props).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("createPubSubFor", () => {
	const obj: Object = {};
	const wkSpy = jest.spyOn(testMod, 'createPubSubFor');
	const result: PubSub = testMod.createPubSubFor(obj);
	expect(result).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDomWalker", () => {
	const wkSpy = jest.spyOn(testMod, 'getDomWalker');
	const aWalkr: DomWalker<ComponentInternals> = testMod.getDomWalker();
	expect(aWalkr).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getCydranContext", () => {
	const wkSpy = jest.spyOn(testMod, 'getCydranContext');
	const context: CydranContext = testMod.getCydranContext();
	expect(context).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDom", () => {
	const wkSpy = jest.spyOn(testMod, 'getDom');
	const wkDom: Dom = testMod.getDom();
	expect(wkDom).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getLogger", () => {
	const wkSpy = jest.spyOn(testMod, 'getLogger');
	const logger: Logger = testMod.getLogger();
	expect(logger).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("clear", () => {
	const wkSpy = jest.spyOn(testMod, 'clear');
	const result: Module = testMod.clear();
	expect(result).toEqual(testMod);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getModule", () => {
	const wkSpy = jest.spyOn(testMod, 'getModule');
	const result: Module = testMod.getModule(TEST);
	expect(result.getName()).toEqual(testMod.getName());
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDefaultModule", () => {
	const wkSpy = jest.spyOn(testMod, 'getDefaultModule');
	const result: Module = testMod.getDefaultModule();
	expect(result.getName()).toEqual(DEFAULT_MODULE_KEY);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getScope", () => {
	const wkSpy = jest.spyOn(testMod, 'getScope');
	const result: Scope = testMod.getScope();
	expect(result).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("registerConstant and get", () => {
	const wkSpy = jest.spyOn(testMod, 'registerConstant');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	testMod.registerConstant(wkKey, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(testMod.get(wkKey)).toEqual(wkConst);
	expect(testMod.get("bubba")).toEqual(null);
});

test("registerConstantUnguarded", () => {
	const wkSpy = jest.spyOn(testMod, 'registerConstantUnguarded');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	testMod.registerConstantUnguarded(wkKey, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(testMod.get(wkKey)).toEqual(wkConst);
	expect(testMod.get("bubba")).toEqual(null);
});

test("registerPrototype - confirm prototypical", () => {
	const wkSpy = jest.spyOn(testMod, 'registerPrototype');
	const wkKey: string = "ctpn";
	testMod.registerPrototype(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = testMod.get(wkKey);
	expect(res1).not.toBe(null);
	expect(res1.getCount()).toEqual(0);

	for(let x: number = 0; x < 5; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = testMod.get(wkKey);
	expect(res2.getCount()).toEqual(0);
});

test("registerSingleton - confirm singleton", () => {
	const wkSpy = jest.spyOn(testMod, 'registerSingleton');
	const wkKey: string = "ctpn";
	testMod.registerSingleton(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = testMod.get(wkKey);
	expect(res1).not.toBe(null);
	expect(res1.getCount()).toEqual(0);

	const sCnt: number = 5;
	for(let x: number = 0; x < sCnt; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = testMod.get(wkKey);
	expect(res2.getCount()).toEqual(sCnt);
});

test("addListener", () => {
	const mockListener: ListenerImpl = mock(ListenerImpl);
	const wkSpy = jest.spyOn(testMod, 'addListener');
	testMod.addListener(mockListener);
	expect(wkSpy).toBeCalledTimes(1);
});

test("removeListener", () => {
	const mockListener: ListenerImpl = mock(ListenerImpl);
	const wkSpy = jest.spyOn(testMod, 'removeListener');
	testMod.removeListener(mockListener);
	expect(wkSpy).toBeCalledTimes(1);
});

test("tell", () => {
	const keys: string[] = ["addListener", "removeListener"];
	const mockListener: ListenerImpl = mock(ListenerImpl);
	when(mockListener.getChannelName()).thenReturn("test");
	let callCnt: number = 0;
	const wkSpy: Module = jest.spyOn(testMod, "tell");
	for(const key of keys) {
		testMod.tell(key, mockListener);
		expect(wkSpy).toBeCalledTimes(++callCnt);
	}
});

test("associate", () =>{
	const spy1: Module = jest.spyOn(testMod, 'associate');
	const retMod: Module = testMod.associate(TestComponent);
	expect(spy1).toBeCalledTimes(1);
});

test("disassociate", () =>{
	const spy1: Module = jest.spyOn(testMod, 'disassociate');
	const retMod: Module = testMod.disassociate(TestComponent);
	expect(spy1).toBeCalledTimes(1);
});
