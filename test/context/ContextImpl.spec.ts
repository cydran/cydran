import { assertNullGuarded, NullTester } from 'test/TestUtils';
import { MutableProperties } from 'interface/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ScopeImpl from 'scope/ScopeImpl';
import ContextImpl from 'context/ContextImpl';
import ContextsImpl from 'context/ContextsImpl';
import Context from 'context/Context';
import Logger from 'log/Logger';
import LoggerImpl from 'log/LoggerImpl';
import DomImpl from 'dom/DomImpl';
import Dom from 'dom/Dom';
import DomWalker from 'component/DomWalker';
import MvvmDomWalkerImpl from 'component/MvvmDomWalkerImpl';
import ServicesImpl from 'service/ServicesImpl';
import Services from 'service/Services';
import PubSub from "message/PubSub";
import ComponentInternals from "component/ComponentInternals";
import { DEFAULT_CONTEXT_KEY } from "Constants";
import Scope from "scope/Scope";
import { mock, when } from "ts-mockito";
import ListenerImpl from "message/ListenerImpl";
import RegistryStrategy from "registry/RegistryStrategy";
import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import Contexts from "context/Contexts";

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

function domInstance(): Dom {
	return new DomImpl();
}

function servicesInstance(): Services {
	return new ServicesImpl(domInstance());
}

function walkerInstance(): DomWalker {
	return new MvvmDomWalkerImpl(servicesInstance());
}

function contextsInstance(): ContextsImpl {
	return new ContextsImpl(servicesInstance());
}

function propertiesInstance(): MutableProperties {
	return new PropertiesImpl();
}

function context(): ContextImpl {
	const contexts: Contexts = contextsInstance();
	contexts.addNamedContext(TEST);

	return contexts.getContext(TEST);
	// new ContextImpl(services(), walker(), TEST, contexts(), scope, properties())
}

const tester: NullTester = new NullTester()
	.addFactory("services", servicesInstance)
	.addFactory("dom", domInstance)
	.addFactory("walker", walkerInstance)
	.addFactory("contexts", contextsInstance)
	.addFactory("scope", () => new ScopeImpl())
	.addFactory("properties", () => propertiesInstance)
	.addFactory(ID, () => ID)
	.addFactory("instance", () => FOO)
	.addFactory("classInstance", () => ContextImpl)
	.addFactory("channelName", () => "channelName")
	.addFactory("messageName", () => "messageName")
	.addFactory("payload", () => FOO);


let testMod: Context = null;
beforeEach(() => {
	testMod = context();
});

afterEach(() => {
	testMod = null;
});

test("Constructor arguments", () => {
	tester.testConstructor(ContextImpl, ["services", "walker", null, "contexts", null, "properties"]);
});

test("message() - nulls", () => {
	tester.testMethod(testMod, ContextImpl.prototype.message, ["channelName", "messageName", null]);
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
	tester.testMethod(testMod, ContextImpl.prototype.broadcast, ["channelName", "messageName", null]);
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
	tester.testMethod(testMod, ContextImpl.prototype.registerConstant, [ID, "instance"]);
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerSingleton(INV_ID, TestClass, []), "ValidationError");
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(testMod, ContextImpl.prototype.registerSingleton, [ID, "classInstance"]);
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testMod.registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(testMod, ContextImpl.prototype.registerPrototype, [ID, "classInstance"]);
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
	const spyTestMod: Context = jest.spyOn(testMod, 'clear');
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
	expect(props).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("createPubSubFor", () => {
	const obj: Object = {};
	const wkSpy = jest.spyOn(testMod, 'createPubSubFor');
	const result: PubSub = testMod.createPubSubFor(obj);
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDomWalker", () => {
	const wkSpy = jest.spyOn(testMod, 'getDomWalker');
	const aWalkr: DomWalker<ComponentInternals> = testMod.getDomWalker();
	expect(aWalkr).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getServices", () => {
	const wkSpy = jest.spyOn(testMod, 'getServices');
	const services: Services = testMod.getServices();
	expect(services).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDom", () => {
	const wkSpy = jest.spyOn(testMod, 'getDom');
	const wkDom: Dom = testMod.getDom();
	expect(wkDom).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getLogger", () => {
	const wkSpy = jest.spyOn(testMod, 'getLogger');
	const logger: Logger = testMod.getLogger();
	expect(logger).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("clear", () => {
	const wkSpy = jest.spyOn(testMod, 'clear');
	const result: Context = testMod.clear();
	expect(result).toEqual(testMod);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getContext", () => {
	const wkSpy = jest.spyOn(testMod, 'getContext');
	const result: Context = testMod.getContext(TEST);
	expect(result.getName()).toEqual(testMod.getName());
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDefaultContext", () => {
	const wkSpy = jest.spyOn(testMod, 'getDefaultContext');
	const result: Context = testMod.getDefaultContext();
	expect(result.getName()).toEqual(DEFAULT_CONTEXT_KEY);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getScope", () => {
	const wkSpy = jest.spyOn(testMod, 'getScope');
	const result: Scope = testMod.getScope();
	expect(result).not.toBeNull();
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
	expect(res1).not.toBeNull();
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
	expect(res1).not.toBeNull();
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
	const wkSpy: Context = jest.spyOn(testMod, "tell");
	for(const key of keys) {
		testMod.tell(key, mockListener);
		expect(wkSpy).toBeCalledTimes(++callCnt);
	}
});

test("associate", () =>{
	const spy1: Context = jest.spyOn(testMod, 'associate');
	const retMod: Context = testMod.associate(TestComponent);
	expect(spy1).toBeCalledTimes(1);
});

test("disassociate", () =>{
	const spy1: Context = jest.spyOn(testMod, 'disassociate');
	const retMod: Context = testMod.disassociate(TestComponent);
	expect(spy1).toBeCalledTimes(1);
});
