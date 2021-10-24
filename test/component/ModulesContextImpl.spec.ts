import { assertNullGuarded, NullTester } from "test/TestUtils";
import ModulesContextImpl from 'module/ModulesContextImpl';
import HiddenBehavior from 'behavior/core/HiddenBehavior';
import Scope from 'scope/Scope';
import ScopeImpl from 'scope/ScopeImpl';
import DomImpl from 'dom/DomImpl';

const PAYLOAD: string = "payload";
const FOO: string = "foo";
const NAME: string = "name";
const MSG_NAME: string = "messageName";
const CH_NAME: string = "channelName";
const SUP_TAGS: string = "supportedTags";

function modulesContext(): ModulesContextImpl {
	return new ModulesContextImpl(new DomImpl());
}

test("Constructor arguments", () => {
	const tester: NullTester = new NullTester()
		.addFactory("dom", () => new DomImpl());

	tester.testConstructor(ModulesContextImpl, ["dom"]);
});

test("get() - nulls", () => {
	const tester: NullTester = new NullTester().addFactory("id", () => new DomImpl());
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.get, ["id"]);
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => modulesContext().get("Invalid id!"), "ValidationError");
});

test("registerPrototype() - nulls", () => {
	const tester: NullTester = new NullTester().addFactory("id", () => "id").addFactory("classInstance", () => ModulesContextImpl);
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.registerPrototype, ["id", "classInstance", null]);
});

test("registerSingleton() - nulls", () => {
	const tester: NullTester = new NullTester().addFactory("id", () => "id").addFactory("classInstance", () => ModulesContextImpl);
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.registerSingleton, ["id", "classInstance", null]);
});

test("registerConstant() - nulls", () => {
	const tester: NullTester = new NullTester().addFactory("id", () => "id").addFactory("instance", () => FOO);
	tester.testMethod(modulesContext(), ModulesContextImpl.prototype.registerConstant, ["id", "instance"]);
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
