import { assertNullGuarded, NullTester } from 'test/TestUtils';
import { MutableProperties } from 'interface/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ScopeImpl from 'scope/ScopeImpl';
import ContextImpl from 'context/ContextImpl';
import Context from 'context/Context';
import Logger from 'log/Logger';
import LoggerImpl from 'log/LoggerImpl';
import DomImpl from 'dom/DomImpl';
import Dom from 'dom/Dom';
import ServicesImpl from 'service/ServicesImpl';
import Services from 'service/Services';
import PubSub from "message/PubSub";
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

const ROOT: string = "root";
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

function propertiesInstance(): MutableProperties {
	return new PropertiesImpl();
}

function context(): ContextImpl {
	return new ContextImpl();
}

const tester: NullTester = new NullTester()
	.addFactory("services", servicesInstance)
	.addFactory("dom", domInstance)
	.addFactory("scope", () => new ScopeImpl())
	.addFactory("properties", () => propertiesInstance)
	.addFactory(ID, () => ID)
	.addFactory("instance", () => FOO)
	.addFactory("classInstance", () => ContextImpl)
	.addFactory("channelName", () => "channelName")
	.addFactory("messageName", () => "messageName")
	.addFactory("payload", () => FOO);


let testContext: Context = null;
beforeEach(() => {
	testContext = context();
});

afterEach(() => {
	testContext = null;
});

test("message() - nulls", () => {
	tester.testMethod(testContext, ContextImpl.prototype.message, ["channelName", "messageName", null]);
});

test("message() - null payload", () => {
	expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
});

test("get() - null id", () => {
	assertNullGuarded(ID, () => testContext.get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.get(INV_ID), "ValidationError");
});

test("getLocal() - null id", () => {
	assertNullGuarded(ID, () => testContext.getLocal(null));
});

test("getLocal() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.getLocal(INV_ID), "ValidationError");
});

test("addStrategy() - null strategy", () => {
	assertNullGuarded("strategy", () => testContext.addStrategy(null));
});

test("addStrategy() - good", () => {
	const wkSpy = jest.spyOn(testContext, 'addStrategy');
	const mockStrat: RegistryStrategy = mock(RegistryStrategy);
	testContext.addStrategy(mockStrat);
	expect(wkSpy).toBeCalledTimes(1);
});

test("expose() - null id", () => {
	assertNullGuarded(ID, () => testContext.expose(null));
});

test("expose() - good", () => {
	const wkSpy = jest.spyOn(testContext, 'expose');
	testContext.expose(TEST);
	expect(wkSpy).toBeCalledTimes(1);
});

test("expose() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.expose(INV_ID), "ValidationError");
});

test("broadcast() - nulls", () => {
	tester.testMethod(testContext, ContextImpl.prototype.broadcast, ["channelName", "messageName", null]);
});

test("broadcast() - null payload", () => {
	expect(() => testContext.broadcast(TEST, TEST, null)).not.toThrowError();
});

test("registerConstant() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.registerConstant(INV_ID, "Foo"), "ValidationError");
});

test("registerConstant() - nulls", () => {
	tester.testMethod(testContext, ContextImpl.prototype.registerConstant, [ID, "instance"]);
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.registerSingleton(INV_ID, TestClass, []), "ValidationError");
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(testContext, ContextImpl.prototype.registerSingleton, [ID, "classInstance"]);
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(testContext, ContextImpl.prototype.registerPrototype, [ID, "classInstance"]);
});

test("registerPrototypeWithFactory() - good", () => {
	const wkSpy = jest.spyOn(testContext, 'registerPrototypeWithFactory');
	testContext.registerPrototypeWithFactory(ID, ()=> { return "<div></div>"; }, []);
	expect(wkSpy).toBeCalledTimes(1);
});

test("registerSingletonWithFactory() - good", () => {
	const wkSpy = jest.spyOn(testContext, 'registerSingletonWithFactory');
	testContext.registerSingletonWithFactory(ID, ()=> { return "<div></div>"; }, []);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getLogger(): Logger", () => {
	const logr: Logger = testContext.getLogger();
	expect(logr).not.toBeNull();
	expect(logr).toBeInstanceOf(LoggerImpl);
});

test("getName(): string", () => {
	const name: string = testContext.getName();
	expect(name).not.toBeNull();
	expect(name).toEqual(ROOT);
});

test("clear(): void", () => {
	const spyTestContext: Context = jest.spyOn(testContext, 'clear');
	testContext.clear();
	expect(spyTestContext).toBeCalledTimes(1);
});

test("hasRegistration", () => {
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	testContext.registerConstant(wkKey, wkConst);
	const wkSpy = jest.spyOn(testContext, 'hasRegistration');
	expect(testContext.hasRegistration("bubba")).toBe(false);
	expect(wkSpy).toBeCalledTimes(1);
	expect(testContext.hasRegistration(wkKey)).toBe(true);
});

test("$dispose", () => {
	const wkSpy = jest.spyOn(testContext, '$dispose');
	const props: MutableProperties = testContext.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getProperties", () => {
	const wkSpy = jest.spyOn(testContext, 'getProperties');
	const props: MutableProperties = testContext.getProperties();
	expect(props).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("createPubSubFor", () => {
	const obj: Object = {};
	const wkSpy = jest.spyOn(testContext, 'createPubSubFor');
	const result: PubSub = testContext.createPubSubFor(obj);
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getServices", () => {
	const wkSpy = jest.spyOn(testContext, 'getServices');
	const services: Services = testContext.getServices();
	expect(services).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDom", () => {
	const wkSpy = jest.spyOn(testContext, 'getDom');
	const wkDom: Dom = testContext.getDom();
	expect(wkDom).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getLogger", () => {
	const wkSpy = jest.spyOn(testContext, 'getLogger');
	const logger: Logger = testContext.getLogger();
	expect(logger).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("clear", () => {
	const wkSpy = jest.spyOn(testContext, 'clear');
	const result: Context = testContext.clear();
	expect(result).toEqual(testContext);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getScope", () => {
	const wkSpy = jest.spyOn(testContext, 'getScope');
	const result: Scope = testContext.getScope();
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("registerConstant and get", () => {
	const wkSpy = jest.spyOn(testContext, 'registerConstant');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	testContext.registerConstant(wkKey, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(testContext.get(wkKey)).toEqual(wkConst);
	expect(testContext.get("bubba")).toEqual(null);
});

test("registerConstantUnguarded", () => {
	const wkSpy = jest.spyOn(testContext, 'registerConstantUnguarded');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	testContext.registerConstantUnguarded(wkKey, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(testContext.get(wkKey)).toEqual(wkConst);
	expect(testContext.get("bubba")).toEqual(null);
});

test("registerPrototype - confirm prototypical", () => {
	const wkSpy = jest.spyOn(testContext, 'registerPrototype');
	const wkKey: string = "ctpn";
	testContext.registerPrototype(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = testContext.get(wkKey);
	expect(res1).not.toBeNull();
	expect(res1.getCount()).toEqual(0);

	for(let x: number = 0; x < 5; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = testContext.get(wkKey);
	expect(res2.getCount()).toEqual(0);
});

test("registerSingleton - confirm singleton", () => {
	const wkSpy = jest.spyOn(testContext, 'registerSingleton');
	const wkKey: string = "ctpn";
	testContext.registerSingleton(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = testContext.get(wkKey);
	expect(res1).not.toBeNull();
	expect(res1.getCount()).toEqual(0);

	const sCnt: number = 5;
	for(let x: number = 0; x < sCnt; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = testContext.get(wkKey);
	expect(res2.getCount()).toEqual(sCnt);
});

test("addListener", () => {
	const mockListener: ListenerImpl = mock(ListenerImpl);
	const wkSpy = jest.spyOn(testContext, 'addListener');
	testContext.addListener(mockListener);
	expect(wkSpy).toBeCalledTimes(1);
});

test("removeListener", () => {
	const mockListener: ListenerImpl = mock(ListenerImpl);
	const wkSpy = jest.spyOn(testContext, 'removeListener');
	testContext.removeListener(mockListener);
	expect(wkSpy).toBeCalledTimes(1);
});

test("tell", () => {
	const keys: string[] = ["addListener", "removeListener"];
	const mockListener: ListenerImpl = mock(ListenerImpl);
	when(mockListener.getChannelName()).thenReturn("test");
	let callCnt: number = 0;
	const wkSpy: Context = jest.spyOn(testContext, "tell");
	for(const key of keys) {
		testContext.tell(key, mockListener);
		expect(wkSpy).toBeCalledTimes(++callCnt);
	}
});
