import ModuleImpl from "module/ModuleImpl";
import CydranContextImpl from "context/CydranContextImpl";
import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import CydranContext from "context/CydranContext";
import { DEFAULT_MODULE_KEY } from "Constants";
import ModulesContext from "module/ModulesContext";
import ModulesContextImpl from "module/ModulesContextImpl";
import { MutableProperties } from 'properties/Property';
import PubSub from "message/PubSub";
import DomWalker from "component/DomWalker";
import ComponentInternals from "component/ComponentInternals";
import Dom from "dom/Dom";
import { Module } from 'module/Module';
import Logger from "log/Logger";
import Scope from "scope/Scope";

let spec: ModuleImpl = null;

class TestClass {
	private count: number = 0;

	construtor() {
		// nothing for now
	}

	public increment(): void {
		++this.count;
	}

	public getCount(): number {
		return this.count;
	}
}

beforeEach(() => {
	const dom: InternalDom = new DomImpl();
	const context: CydranContext = new CydranContextImpl(dom);
	const modContext: ModulesContext = new ModulesContextImpl(context);
	spec = modContext.getModule(DEFAULT_MODULE_KEY);
});

afterEach(() => {
	spec = null;
});

test("whole and healthy for tests", () => {
	expect(spec).not.toBe(null);
});

test("hasRegistration", () => {
	const wkSpy = jest.spyOn(spec, 'hasRegistration');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	spec.registerConstant(wkKey, wkConst);
	expect(spec.hasRegistration("bubba")).toBe(false);
	expect(wkSpy).toBeCalledTimes(1);
	expect(spec.hasRegistration(wkKey)).toBe(true);
});

test("$dispose", () => {
	const wkSpy = jest.spyOn(spec, '$dispose');
	const props: MutableProperties = spec.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getProperties", () => {
	const wkSpy = jest.spyOn(spec, 'getProperties');
	const props: MutableProperties = spec.getProperties();
	expect(props).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("createPubSubFor", () => {
	const obj: Object = {};
	const wkSpy = jest.spyOn(spec, 'createPubSubFor');
	const result: PubSub = spec.createPubSubFor(obj);
	expect(result).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDomWalker", () => {
	const wkSpy = jest.spyOn(spec, 'getDomWalker');
	const walker: DomWalker<ComponentInternals> = spec.getDomWalker();
	expect(walker).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getCydranContext", () => {
	const wkSpy = jest.spyOn(spec, 'getCydranContext');
	const context: CydranContext = spec.getCydranContext();
	expect(context).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDom", () => {
	const wkSpy = jest.spyOn(spec, 'getDom');
	const wkDom: Dom = spec.getDom();
	expect(wkDom).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getLogger", () => {
	const wkSpy = jest.spyOn(spec, 'getLogger');
	const logger: Logger = spec.getLogger();
	expect(logger).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getName", () => {
	const wkSpy = jest.spyOn(spec, 'getName');
	const result: string = spec.getName();
	expect(result).toEqual(DEFAULT_MODULE_KEY);
	expect(wkSpy).toBeCalledTimes(1);
});

test("clear", () => {
	const wkSpy = jest.spyOn(spec, 'clear');
	const result: Module = spec.clear();
	expect(result).toEqual(spec);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getModule", () => {
	const wkSpy = jest.spyOn(spec, 'getModule');
	const result: Module = spec.getModule(DEFAULT_MODULE_KEY);
	expect(result).toEqual(spec);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getDefaultModule", () => {
	const wkSpy = jest.spyOn(spec, 'getDefaultModule');
	const result: Module = spec.getDefaultModule();
	expect(result).toEqual(spec);
	expect(wkSpy).toBeCalledTimes(1);
});

test("getScope", () => {
	const wkSpy = jest.spyOn(spec, 'getScope');
	const result: Scope = spec.getScope();
	expect(result).not.toBe(null);
	expect(wkSpy).toBeCalledTimes(1);
});

test("registerConstant and get", () => {
	const wkSpy = jest.spyOn(spec, 'registerConstant');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	spec.registerConstant(wkKey, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(spec.get(wkKey)).toEqual(wkConst);
	expect(spec.get("bubba")).toEqual(null);
});

test("registerConstantUnguarded", () => {
	const wkSpy = jest.spyOn(spec, 'registerConstantUnguarded');
	const wkKey: string = "ctpn";
	const wkConst: string = "cydran.test.prop.name";
	spec.registerConstantUnguarded(wkKey, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(spec.get(wkKey)).toEqual(wkConst);
	expect(spec.get("bubba")).toEqual(null);
});

test("registerPrototype", () => {
	const wkSpy = jest.spyOn(spec, 'registerPrototype');
	const wkKey: string = "ctpn";
	spec.registerPrototype(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = spec.get(wkKey);
	expect(res1).not.toBe(null);
	expect(res1.getCount()).toEqual(0);

	for(let x: number = 0; x < 5; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = spec.get(wkKey);
	expect(res2.getCount()).toEqual(0);
});

test("registerSingleton", () => {
	const wkSpy = jest.spyOn(spec, 'registerSingleton');
	const wkKey: string = "ctpn";
	spec.registerSingleton(wkKey, TestClass);
	expect(wkSpy).toBeCalledTimes(1);
	const res1: TestClass = spec.get(wkKey);
	expect(res1).not.toBe(null);
	expect(res1.getCount()).toEqual(0);

	const sCnt: number = 5;
	for(let x: number = 0; x < sCnt; x++) {
		res1.increment();
		expect(res1.getCount()).toEqual(x+1);
	}

	const res2 = spec.get(wkKey);
	expect(res2.getCount()).toEqual(sCnt);
});
