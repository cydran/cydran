import { assertNullGuarded, NullTester } from "test/TestUtils";
import ContextsImpl from 'context/ContextsImpl';
import HiddenBehavior from 'behavior/core/HiddenBehavior';
import Scope from 'scope/Scope';
import ScopeImpl from 'scope/ScopeImpl';
import DomImpl from 'dom/DomImpl';
import { MutableProperties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import Services from "service/Services";
import ServicesImpl from "service/ServicesImpl";

const services: Services = new ServicesImpl(new DomImpl(), {});

const ID: string = "id";
const PAYLOAD: string = "payload";
const FOO: string = "foo";
const NAME: string = "name";
const MSG_NAME: string = "messageName";
const CH_NAME: string = "channelName";
const SUP_TAGS: string = "supportedTags";

const tester: NullTester = new NullTester()
	.addFactory(ID, () => ID)
	.addFactory("classInstance", () => ContextsImpl)
	.addFactory("instance", () => FOO)
	.addFactory("dom", () => new DomImpl());

let specimen: ContextsImpl = null;
beforeEach(() => {
	specimen = new ContextsImpl(services);
});

afterEach(() => {
	specimen = null;
});

test("Instantiated", () => {
	expect(specimen).not.toBeNull();
});

test("get() - nulls", () => {
	tester.testMethod(specimen, ContextsImpl.prototype.get, [ID]);
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => specimen.get("Invalid id!"), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(specimen, ContextsImpl.prototype.registerPrototype, [ID, "classInstance", null]);
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(specimen, ContextsImpl.prototype.registerSingleton, [ID, "classInstance", null]);
});

test("registerConstant() - nulls", () => {
	tester.testMethod(specimen, ContextsImpl.prototype.registerConstant, [ID, "instance"]);
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(CH_NAME, () => specimen.broadcast(null, MSG_NAME, PAYLOAD));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(MSG_NAME, () => specimen.broadcast(CH_NAME, null, PAYLOAD));
});

test("broadcast() - null payload", () => {
	let thrown: Error = null;

	try {
		specimen.broadcast(CH_NAME, MSG_NAME, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("registerBehavior() - null name", () => {
	assertNullGuarded(NAME, () => specimen.registerBehavior(null, [SUP_TAGS], HiddenBehavior));
});

test("registerBehavior() - null supportedTags", () => {
	assertNullGuarded(SUP_TAGS, () => specimen.registerBehavior(NAME, null, HiddenBehavior));
});

test("registerBehavior() - null behaviorClass", () => {
	assertNullGuarded("behaviorClass", () => specimen.registerBehavior(NAME, [SUP_TAGS], null));
});

test("registerBehavior() - good", () => {
	const wkSpy = jest.spyOn(specimen, 'registerBehavior');
	expect((): void => {
		specimen.registerBehavior(NAME, [SUP_TAGS], HiddenBehavior);
	}).not.toThrowError();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getContext() - null name", () => {
	assertNullGuarded(NAME, () => specimen.getContext(null));
});

test("forEach() - null fn", () => {
	assertNullGuarded("fn", () => specimen.forEach(null));
});

test("getScope(): Scope", () => {
	const result: Scope = specimen.getScope();
	expect(result).not.toBeNull();
	expect(result).toBeInstanceOf(ScopeImpl);
});

test("Contexts.getInstances()", () => {
	const instances: ContextsImpl[] = ContextsImpl.getInstances();
	expect(instances).not.toBeNull();
	expect(instances.length).toBeGreaterThan(1);
});

test("Contexts.resetInstances()", () => {
	ContextsImpl.resetInstances();
	const instances: ContextsImpl[] = ContextsImpl.getInstances();
	expect(instances).not.toBeNull();
	expect(instances.length).toBe(0);
});

test("registerConstantUnguarded", () => {
	const wkSpy = jest.spyOn(specimen, 'registerConstantUnguarded');
	const wkConst: any = {};
	const wkId: string = ID + 0;
	specimen.registerConstantUnguarded(wkId, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(specimen.get(wkId)).toEqual(wkConst);
});

test("registerPrototypeWithFactory", () => {
	const wkSpy = jest.spyOn(specimen, 'registerPrototypeWithFactory');
	const wkId: string = ID + 0;
	const wkFactory: any = () => { return wkId; };
	specimen.registerPrototypeWithFactory(wkId, wkFactory);
	expect(wkSpy).toBeCalledTimes(1);
	expect(specimen.get(wkId)).toEqual(wkId);
});

test("registerSingletonWithFactory", () => {
	class SingletonTest {
		private cnt: number = 0;

		constructor() {
			//
		}

		getCount(): number {
			return this.cnt++;
		}
	}
	const wkSpy = jest.spyOn(specimen, 'registerSingletonWithFactory');

	let x: number = 0;
	const wkId: string = ID + 0;
	specimen.registerSingletonWithFactory(wkId, () => new SingletonTest());
	expect(wkSpy).toBeCalledTimes(1);
	while(x < 5) {
		expect(specimen.get(wkId).getCount()).toEqual(x++);
	}
});

test("getProperties", () => {
	const wkSpy = jest.spyOn(specimen, 'getProperties');

	const props: MutableProperties = specimen.getProperties();
	expect(wkSpy).toBeCalledTimes(1);
	expect(props).not.toBeNull();
	expect(props).toBeInstanceOf(PropertiesImpl);
});

test("$dispose", () => {
	const wkSpy = jest.spyOn(specimen, '$dispose');
	specimen.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});
