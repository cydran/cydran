import ModulesContext from "@/module/ModulesContext";
import Scope from "@/model/Scope";
import ScopeImpl from "@/model/ScopeImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { spy, verify } from "ts-mockito";
import ModulesContextImpl from "@/module/ModulesContextImpl";

describe("Modules tests", () => {
	const EMPTY_ARY: any[] = [];
	const EMPTY_FN: Function = function() { /**/ };
	const ID: string = "id";
	const PAYLOAD: string = "payload";
	const FOO: string = "foo";
	const NAME: string = "name";
	const MSG_NAME: string = "messageName";
	const CH_NAME: string = "channelName";
	const SUP_TAGS: string = "supportedTags";

	it("get() - null id", () => {
		assertNullGuarded(ID, () => new ModulesContextImpl().get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new ModulesContextImpl().get("Invalid id!"), "ValidationError");
	});

	it("registerPrototype() - null id", () => {
		assertNullGuarded(ID, () => new ModulesContextImpl().registerPrototype(null, EMPTY_FN, EMPTY_ARY));
	});

	it("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => new ModulesContextImpl().registerPrototype(FOO, null, EMPTY_ARY));
	});

	it("registerSingleton() - null id", () => {
		assertNullGuarded(ID, () => new ModulesContextImpl().registerSingleton(null, function() {
			// Intentionally do nothing
		}, EMPTY_ARY));
	});

	it("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => new ModulesContextImpl().registerSingleton(FOO, null, EMPTY_ARY));
	});

	it("registerConstant() - null id", () => {
		assertNullGuarded(ID, () => new ModulesContextImpl().registerConstant(null, {}));
	});

	it("registerConstant() - null instance", () => {
		assertNullGuarded("instance", () => new ModulesContextImpl().registerConstant(FOO, null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded(CH_NAME, () => new ModulesContextImpl().broadcast(null, MSG_NAME, PAYLOAD));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded(MSG_NAME, () => new ModulesContextImpl().broadcast(CH_NAME, null, PAYLOAD));
	});

	it("broadcast() - null payload", () => {
		let thrown: Error = null;

		try {
			new ModulesContextImpl().broadcast(CH_NAME, MSG_NAME, null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("registerElementMediator() - null name", () => {
		assertNullGuarded(NAME, () => new ModulesContextImpl().registerElementMediator(null, [SUP_TAGS], EMPTY_FN));
	});

	it("registerElementMediator() - null supportedTags", () => {
		assertNullGuarded(SUP_TAGS, () => new ModulesContextImpl().registerElementMediator(NAME, null, EMPTY_FN));
	});

	it("registerElementMediator() - null elementMediatorClass", () => {
		assertNullGuarded("elementMediatorClass", () => new ModulesContextImpl().registerElementMediator(NAME, [SUP_TAGS], null));
	});

	it("getModule() - null name", () => {
		assertNullGuarded(NAME, () => new ModulesContextImpl().getModule(null));
	});

	it("forEach() - null fn", () => {
		assertNullGuarded("fn", () => new ModulesContextImpl().forEach(null));
	});

	it("getScope(): Scope", () => {
		const result: Scope = new ModulesContextImpl().getScope();
		assert.isNotNull(result);
		assert.instanceOf(result, ScopeImpl);
	});

});
