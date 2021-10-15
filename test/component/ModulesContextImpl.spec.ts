import { assertNullGuarded } from "test/TestUtils";
import ModulesContextImpl from 'module/ModulesContextImpl';
import HiddenBehavior from 'behavior/core/HiddenBehavior';
import Scope from 'scope/Scope';
import ScopeImpl from 'scope/ScopeImpl';

const EMPTY_ARY: any[] = [];
const EMPTY_FN: Function = function() { /**/ };
const ID: string = "id";
const PAYLOAD: string = "payload";
const FOO: string = "foo";
const NAME: string = "name";
const MSG_NAME: string = "messageName";
const CH_NAME: string = "channelName";
const SUP_TAGS: string = "supportedTags";

test("get() - null id", () => {
	assertNullGuarded(ID, () => new ModulesContextImpl().get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new ModulesContextImpl().get("Invalid id!"), "ValidationError");
});

test("registerPrototype() - null id", () => {
	assertNullGuarded(ID, () => new ModulesContextImpl().registerPrototype(null, HiddenBehavior, EMPTY_ARY));
});

test("registerPrototype() - null classInstance", () => {
	assertNullGuarded("classInstance", () => new ModulesContextImpl().registerPrototype(FOO, null, EMPTY_ARY));
});

test("registerSingleton() - null id", () => {
	assertNullGuarded(ID, () => new ModulesContextImpl().registerSingleton(null, HiddenBehavior, EMPTY_ARY));
});

test("registerSingleton() - null classInstance", () => {
	assertNullGuarded("classInstance", () => new ModulesContextImpl().registerSingleton(FOO, null, EMPTY_ARY));
});

test("registerConstant() - null id", () => {
	assertNullGuarded(ID, () => new ModulesContextImpl().registerConstant(null, {}));
});

test("registerConstant() - null instance", () => {
	assertNullGuarded("instance", () => new ModulesContextImpl().registerConstant(FOO, null));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(CH_NAME, () => new ModulesContextImpl().broadcast(null, MSG_NAME, PAYLOAD));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(MSG_NAME, () => new ModulesContextImpl().broadcast(CH_NAME, null, PAYLOAD));
});

test("broadcast() - null payload", () => {
	let thrown: Error = null;

	try {
		new ModulesContextImpl().broadcast(CH_NAME, MSG_NAME, null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).toBeNull();
});

test("registerBehavior() - null name", () => {
	assertNullGuarded(NAME, () => new ModulesContextImpl().registerBehavior(null, [SUP_TAGS], HiddenBehavior));
});

test("registerBehavior() - null supportedTags", () => {
	assertNullGuarded(SUP_TAGS, () => new ModulesContextImpl().registerBehavior(NAME, null, HiddenBehavior));
});

test("registerBehavior() - null behaviorClass", () => {
	assertNullGuarded("behaviorClass", () => new ModulesContextImpl().registerBehavior(NAME, [SUP_TAGS], null));
});

test("getModule() - null name", () => {
	assertNullGuarded(NAME, () => new ModulesContextImpl().getModule(null));
});

test("forEach() - null fn", () => {
	assertNullGuarded("fn", () => new ModulesContextImpl().forEach(null));
});

test("getScope(): Scope", () => {
	const result: Scope = new ModulesContextImpl().getScope();
	expect(result).not.toBeNull();
	expect(result).toBeInstanceOf(ScopeImpl);
});
