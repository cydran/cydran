import { assertNullGuarded, NullTester } from "test/TestUtils";
import ModulesContextImpl from 'module/ModulesContextImpl';
import HiddenBehavior from 'behavior/core/HiddenBehavior';
import Scope from 'scope/Scope';
import ScopeImpl from 'scope/ScopeImpl';
import DomImpl from 'dom/DomImpl';
import { MutableProperties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";

class SingletonTest {
	private cnt: number = 0;

	constructor() {
		//
	}

	getCount(): number {
		return this.cnt++;
	}
}

const ID: string = "id";
const PAYLOAD: string = "payload";
const FOO: string = "foo";
const NAME: string = "name";
const MSG_NAME: string = "messageName";
const CH_NAME: string = "channelName";
const SUP_TAGS: string = "supportedTags";

function modulesContext(): ModulesContextImpl {
	return new ModulesContextImpl(new DomImpl());
}

const tester: NullTester = new NullTester()
	.addFactory(ID, () => ID)
	.addFactory("classInstance", () => ModulesContextImpl)
	.addFactory("instance", () => FOO)
	.addFactory("dom", () => new DomImpl());

test("Constructor arguments", () => {
	tester.testConstructor(ModulesContextImpl, ["dom"]);
});

test("get() - nulls", () => {
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.get, [ID]);
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => modulesContext().get("Invalid id!"), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.registerPrototype, [ID, "classInstance", null]);
});

test("registerSingleton() - nulls", () => {
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.registerSingleton, [ID, "classInstance", null]);
});

test("registerConstant() - nulls", () => {
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.registerConstant, [ID, "instance"]);
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(CH_NAME, () => modulesContext().broadcast(null, MSG_NAME, PAYLOAD));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(MSG_NAME, () => modulesContext().broadcast(CH_NAME, null, PAYLOAD));
});

test("broadcast() - null payload", () => {
	let thrown: Error = null;

	try {
		modulesContext().broadcast(CH_NAME, MSG_NAME, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("registerBehavior() - null name", () => {
	assertNullGuarded(NAME, () => modulesContext().registerBehavior(null, [SUP_TAGS], HiddenBehavior));
});

test("registerBehavior() - null supportedTags", () => {
	assertNullGuarded(SUP_TAGS, () => modulesContext().registerBehavior(NAME, null, HiddenBehavior));
});

test("registerBehavior() - null behaviorClass", () => {
	assertNullGuarded("behaviorClass", () => modulesContext().registerBehavior(NAME, [SUP_TAGS], null));
});

test("registerBehavior() - good", () => {
	const wkMod: ModulesContextImpl = modulesContext();
	const wkSpy = jest.spyOn(wkMod, 'registerBehavior');
	expect((): void => {
		wkMod.registerBehavior(NAME, [SUP_TAGS], HiddenBehavior);
	}).not.toThrowError();
	expect(wkSpy).toBeCalledTimes(1);
});

test("getModule() - null name", () => {
	assertNullGuarded(NAME, () => modulesContext().getModule(null));
});

test("forEach() - null fn", () => {
	assertNullGuarded("fn", () => modulesContext().forEach(null));
});

test("getScope(): Scope", () => {
	const result: Scope = modulesContext().getScope();
	expect(result).not.toBeNull();
	expect(result).toBeInstanceOf(ScopeImpl);
});

test("ModulesContext.getInstances()", () => {
	const modContexts: ModulesContextImpl[] = ModulesContextImpl.getInstances();
	expect(modContexts).not.toBeNull();
	expect(modContexts.length).toBeGreaterThan(1);
});

test("ModulesContext.resetInstances()", () => {
	ModulesContextImpl.resetInstances();
	const modContexts: ModulesContextImpl[] = ModulesContextImpl.getInstances();
	expect(modContexts).not.toBeNull();
	expect(modContexts.length).toBe(0);
});

test("registerConstantUnguarded", () => {
	const wkMod: ModulesContextImpl = modulesContext();
	const wkSpy = jest.spyOn(wkMod, 'registerConstantUnguarded');
	const wkConst: any = {};
	const wkId: string = ID + 0;
	wkMod.registerConstantUnguarded(wkId, wkConst);
	expect(wkSpy).toBeCalledTimes(1);
	expect(wkMod.get(wkId)).toEqual(wkConst);
});

test("registerPrototypeWithFactory", () => {
	const wkMod: ModulesContextImpl = modulesContext();
	const wkSpy = jest.spyOn(wkMod, 'registerPrototypeWithFactory');
	const wkId: string = ID + 0;
	const wkFactory: any = () => { return wkId; };
	wkMod.registerPrototypeWithFactory(wkId, wkFactory);
	expect(wkSpy).toBeCalledTimes(1);
	expect(wkMod.get(wkId)).toEqual(wkId);
});

test("registerSingletonWithFactory", () => {
	const wkMod: ModulesContextImpl = modulesContext();
	const wkSpy = jest.spyOn(wkMod, 'registerSingletonWithFactory');

	let x: number = 0;
	const wkId: string = ID + 0;
	wkMod.registerSingletonWithFactory(wkId, () => new SingletonTest());
	expect(wkSpy).toBeCalledTimes(1);
	while(x < 5) {
		expect(wkMod.get(wkId).getCount()).toEqual(x++);
	}
});

test("getProperties", () => {
	const wkMod: ModulesContextImpl = modulesContext();
	const wkSpy = jest.spyOn(wkMod, 'getProperties');

	const props: MutableProperties = wkMod.getProperties();
	expect(wkSpy).toBeCalledTimes(1);
	expect(props).not.toBeNull();
	expect(props).toBeInstanceOf(PropertiesImpl);
});

test("$dispose", () => {
	const wkMod: ModulesContextImpl = modulesContext();
	const wkSpy = jest.spyOn(wkMod, '$dispose');
	wkMod.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});
