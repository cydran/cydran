import { test, expect, beforeEach, afterEach, jest, describe } from '@jest/globals';
import { assertNullGuarded, NullTester } from 'test/TestUtils';
import { MutableProperties } from 'interface/Property';
import PropertiesImpl from 'properties/PropertiesImpl';
import ScopeImpl from 'scope/ScopeImpl';
import Scope from "scope/Scope";
import { mock, when } from "ts-mockito";
import RegistryStrategy from "registry/RegistryStrategy";
import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import GlobalContextImpl from 'context/GlobalContextImpl';
import Context from 'context/Context';
import { RootContextImpl } from 'context/AbstractNamedContextImpl';

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
const INV_ID: string = "Invalid /id!";
const ID: string = "id";
const scope: ScopeImpl = new ScopeImpl();

function propertiesInstance(): MutableProperties {
	return new PropertiesImpl();
}

const tester: NullTester = new NullTester()
	.addFactory("scope", () => new ScopeImpl())
	.addFactory("properties", () => propertiesInstance)
	.addFactory(ID, () => ID)
	.addFactory("instance", () => FOO)
	.addFactory("classInstance", () => RootContextImpl)
	.addFactory("channelName", () => "channelName")
	.addFactory("messageName", () => "messageName")
	.addFactory("payload", () => FOO);

describe("RootContextImpl", () => {

	let testContext: Context = null;

	beforeEach(() => {
		testContext = new GlobalContextImpl().createChild();
	});

	afterEach(() => {
		testContext = null;
	});

	test("message() - nulls", () => {
		tester.testMethod(testContext, RootContextImpl.prototype.message, ["channelName", "messageName", null]);
	});

	test("message() - null payload", () => {
		expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
	});

	test("get() - null id", () => {
		assertNullGuarded("path", () => testContext.getObject(null));
	});

	test("get() - invalid id", () => {
		assertNullGuarded("path must be valid", () => testContext.getObject(INV_ID), "ValidationError");
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


	test("message() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.message, ["channelName", "messageName", null]);
	});

	test("message() - null payload", () => {
		expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
	});

	test("registerConstant() - invalid id", () => {
		assertNullGuarded("id must be valid", () => testContext.registerConstant(INV_ID, "Foo"), "ValidationError");
	});

	test("registerConstant() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.registerConstant, [ID, "instance"]);
	});

	test("registerSingleton() - invalid id", () => {
		assertNullGuarded("id must be valid", () => testContext.registerSingleton(INV_ID, TestClass, []), "ValidationError");
	});

	test("registerSingleton() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.registerSingleton, [ID, "classInstance"]);
	});

	test("registerPrototype() - invalid id", () => {
		assertNullGuarded("id must be valid", () => testContext.registerPrototype(INV_ID,
			TestClass, []), "ValidationError");
	});

	test("registerPrototype() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.registerPrototype, [ID, "classInstance"]);
	});

	test("registerPrototypeWithFactory() - good", () => {
		const wkSpy = jest.spyOn(testContext, 'registerPrototypeWithFactory');
		testContext.registerPrototypeWithFactory(ID, () => { return "<div></div>"; }, []);
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("registerSingletonWithFactory() - good", () => {
		const wkSpy = jest.spyOn(testContext, 'registerSingletonWithFactory');
		testContext.registerSingletonWithFactory(ID, () => { return "<div></div>"; }, []);
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("getName(): string", () => {
		const name: string = testContext.getName();
		expect(name).not.toBeNull();
		expect(name).toEqual("Root");
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

	test("$release", () => {
		const wkSpy = jest.spyOn(testContext, '$release');
		const props: MutableProperties = testContext.$release();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("getProperties", () => {
		const wkSpy = jest.spyOn(testContext, 'getProperties');
		const props: MutableProperties = testContext.getProperties();
		expect(props).not.toBeNull();
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

		for (let x: number = 0; x < 5; x++) {
			res1.increment();
			expect(res1.getCount()).toEqual(x + 1);
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
		for (let x: number = 0; x < sCnt; x++) {
			res1.increment();
			expect(res1.getCount()).toEqual(x + 1);
		}

		const res2 = testContext.getObject(wkKey);
		expect(res2.getCount()).toEqual(sCnt);
	});

	test("getName - Names set as expected", () => {
		const child: Context = testContext.addChild("first");
		const grandChild: Context = child.addChild("second");

		expect(testContext.getName()).toEqual("Root");
		expect(child.getName()).toEqual("first");
		expect(grandChild.getName()).toEqual("second");
	});

	test("getFullName - Full names are as expected", () => {
		const child: Context = testContext.addChild("first");
		const grandChild: Context = child.addChild("second");

		expect(testContext.getFullName()).toEqual("Root");
		expect(child.getFullName()).toEqual("first");
		expect(grandChild.getFullName()).toEqual("first.second");
	});

});
