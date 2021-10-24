import { assertNullGuarded } from "test/TestUtils";
import ModulesContextImpl from 'module/ModulesContextImpl';
import HiddenBehavior from 'behavior/core/HiddenBehavior';
import Scope from 'scope/Scope';
import ScopeImpl from 'scope/ScopeImpl';
import DomImpl from 'dom/DomImpl';

const EMPTY_ARY: any[] = [];
const EMPTY_FN: Function = function() { /**/ };
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

test("get() - null id", () => {
	assertNullGuarded(ID, () => modulesContext().get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => modulesContext().get("Invalid id!"), "ValidationError");
});

test("registerPrototype() - null id", () => {
	assertNullGuarded(ID, () => modulesContext().registerPrototype(null, HiddenBehavior, EMPTY_ARY));
});

test("registerPrototype() - null classInstance", () => {
	assertNullGuarded("classInstance", () => modulesContext().registerPrototype(FOO, null, EMPTY_ARY));
});

test("registerSingleton() - null id", () => {
	assertNullGuarded(ID, () => modulesContext().registerSingleton(null, HiddenBehavior, EMPTY_ARY));
});

test("registerSingleton() - null classInstance", () => {
	assertNullGuarded("classInstance", () => modulesContext().registerSingleton(FOO, null, EMPTY_ARY));
});

test("registerConstant() - null id", () => {
	assertNullGuarded(ID, () => modulesContext().registerConstant(null, {}));
});

test("registerConstant() - null instance", () => {
	assertNullGuarded("instance", () => modulesContext().registerConstant(FOO, null));
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
