import { assertNullGuarded, NullTester } from 'test/TestUtils';
import { MutableProperties } from 'interface/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ScopeImpl from 'scope/ScopeImpl';
import Context from 'context/Context';
import Logger from 'log/Logger';
import LoggerImpl from 'log/LoggerImpl';
import PubSub from "message/PubSub";
import Scope from "scope/Scope";
import { mock, when } from "ts-mockito";
import RegistryStrategy from "registry/RegistryStrategy";
import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import { StageImpl } from 'context/RootContextImpl';
import Ids from "const/IdsFields";

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

function propertiesInstance(): MutableProperties {
	return new PropertiesImpl();
}

function context(): StageImpl {
	return new StageImpl("body");
}

const tester: NullTester = new NullTester()
	.addFactory("scope", () => new ScopeImpl())
	.addFactory("properties", () => propertiesInstance)
	.addFactory(ID, () => ID)
	.addFactory("instance", () => FOO)
	.addFactory("classInstance", () => StageImpl)
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
	tester.testMethod(testContext, StageImpl.prototype.message, ["channelName", "messageName", null]);
});

test("message() - null payload", () => {
	expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
});

test("get() - null id", () => {
	assertNullGuarded(ID, () => testContext.getObject(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.getObject(INV_ID), "ValidationError");
});

test("getLocalObject() - null id", () => {
	assertNullGuarded(ID, () => testContext.getLocalObject(null));
});

test("getLocalObject() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.getLocalObject(INV_ID), "ValidationError");
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

test("message() - nulls", () => {
	tester.testMethod(testContext, StageImpl.prototype.message, ["channelName", "messageName", null]);
});

test("message() - null payload", () => {
	expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
});

test("registerConstant() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.registerConstant(INV_ID, "Foo"), "ValidationError");
});

test("registerConstant() - nulls", () => {
	tester.testMethod(testContext, StageImpl.prototype.registerConstant, [ID, "instance"]);
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.registerSingleton(INV_ID, TestClass, []), "ValidationError");
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(testContext, StageImpl.prototype.registerSingleton, [ID, "classInstance"]);
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => testContext.registerPrototype(INV_ID,
		TestClass, []), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(testContext, StageImpl.prototype.registerPrototype, [ID, "classInstance"]);
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
	expect(name).toEqual(Ids.STAGE);
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

test("getLogger", () => {
	const wkSpy = jest.spyOn(testContext, 'getLogger');
	const logger: Logger = testContext.getLogger();
	expect(logger).not.toBeNull();
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
	expect(testContext.getObject(wkKey)).toEqual(wkConst);
	expect(testContext.getObject("bubba")).toEqual(null);
});

test("registerPrototype - confirm prototypical", () => {
	const wkSpy = jest.spyOn(testContext, 'registerPrototype');
	const wkKey: string = "ctpn";
	testContext.registerPrototype(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = testContext.getObject(wkKey);
	expect(res1).not.toBeNull();
	expect(res1.getCount()).toEqual(0);

	for(let x: number = 0; x < 5; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = testContext.getObject(wkKey);
	expect(res2.getCount()).toEqual(0);
});

test("registerSingleton - confirm singleton", () => {
	const wkSpy = jest.spyOn(testContext, 'registerSingleton');
	const wkKey: string = "ctpn";
	testContext.registerSingleton(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = testContext.getObject(wkKey);
	expect(res1).not.toBeNull();
	expect(res1.getCount()).toEqual(0);

	const sCnt: number = 5;
	for(let x: number = 0; x < sCnt; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = testContext.getObject(wkKey);
	expect(res2.getCount()).toEqual(sCnt);
});
