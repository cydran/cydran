import { Modules } from "@/Core";
import { assertNullGuarded } from "@/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";

describe("Modules tests", () => {

	it("get() - null id", () => {
		assertNullGuarded("id", () => Modules.get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => Modules.get("Invalid id!"), "ValidationError");
	});

	it("registerPrototype() - null id", () => {
		assertNullGuarded("id", () => Modules.registerPrototype(null, function() {
			// Intentionally do nothing
		}, []));
	});

	it("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => Modules.registerPrototype("foo", null, []));
	});

	it("registerSingleton() - null id", () => {
		assertNullGuarded("id", () => Modules.registerSingleton(null, function() {
			// Intentionally do nothing
		}, []));
	});

	it("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => Modules.registerSingleton("foo", null, []));
	});

	it("registerConstant() - null id", () => {
		assertNullGuarded("id", () => Modules.registerConstant(null, {}));
	});

	it("registerConstant() - null instance", () => {
		assertNullGuarded("instance", () => Modules.registerConstant("foo", null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => Modules.broadcast(null, "messageName", "payload"));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("messageName", () => Modules.broadcast("channelName", null, "payload"));
	});

	it("broadcast() - null payload", () => {
		let thrown: Error = null;

		try {
			Modules.broadcast("channelName", "messageName", null);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(thrown);
	});

	it("registerElementMediator() - null name", () => {
		assertNullGuarded("name", () => Modules.registerElementMediator(null, ["supportedTags"], function() {
			// Intentionally do nothing
		}));
	});

	it("registerElementMediator() - null supportedTags", () => {
		assertNullGuarded("supportedTags", () => Modules.registerElementMediator("name", null, function() {
			// Intentionally do nothing
		}));
	});

	it("registerElementMediator() - null elementMediatorClass", () => {
		assertNullGuarded("elementMediatorClass", () => Modules.registerElementMediator("name", ["supportedTags"], null));
	});

	it("getModule() - null name", () => {
		assertNullGuarded("name", () => Modules.getModule(null));
	});

	it("forEach() - null fn", () => {
		assertNullGuarded("fn", () => Modules.forEach(null));
	});

});
