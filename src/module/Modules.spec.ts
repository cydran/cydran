import { Modules } from "@/module/Modules";
import Scope from "@/model/Scope";
import ScopeImpl from "@/model/ScopeImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { spy, verify } from "ts-mockito";

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
		assertNullGuarded(ID, () => Modules.get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => Modules.get("Invalid id!"), "ValidationError");
	});

	it("registerPrototype() - null id", () => {
		assertNullGuarded(ID, () => Modules.registerPrototype(null, EMPTY_FN, EMPTY_ARY));
	});

	it("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => Modules.registerPrototype(FOO, null, EMPTY_ARY));
	});

	it("registerSingleton() - null id", () => {
		assertNullGuarded(ID, () => Modules.registerSingleton(null, function() {
			// Intentionally do nothing
		}, EMPTY_ARY));
	});

	it("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => Modules.registerSingleton(FOO, null, EMPTY_ARY));
	});

	it("registerConstant() - null id", () => {
		assertNullGuarded(ID, () => Modules.registerConstant(null, {}));
	});

	it("registerConstant() - null instance", () => {
		assertNullGuarded("instance", () => Modules.registerConstant(FOO, null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded(CH_NAME, () => Modules.broadcast(null, MSG_NAME, PAYLOAD));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded(MSG_NAME, () => Modules.broadcast(CH_NAME, null, PAYLOAD));
	});

	it("broadcast() - null payload", () => {
		let thrown: Error = null;

		try {
			Modules.broadcast(CH_NAME, MSG_NAME, null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("registerElementMediator() - null name", () => {
		assertNullGuarded(NAME, () => Modules.registerElementMediator(null, [SUP_TAGS], EMPTY_FN));
	});

	it("registerElementMediator() - null supportedTags", () => {
		assertNullGuarded(SUP_TAGS, () => Modules.registerElementMediator(NAME, null, EMPTY_FN));
	});

	it("registerElementMediator() - null elementMediatorClass", () => {
		assertNullGuarded("elementMediatorClass", () => Modules.registerElementMediator(NAME, [SUP_TAGS], null));
	});

	it("getModule() - null name", () => {
		assertNullGuarded(NAME, () => Modules.getModule(null));
	});

	it("forEach() - null fn", () => {
		assertNullGuarded("fn", () => Modules.forEach(null));
	});

	it("getScope(): Scope", () => {
		const result: Scope = Modules.getScope();
		assert.isNotNull(result);
		assert.instanceOf(result, ScopeImpl);
	});

});
