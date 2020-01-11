import { Properties } from "@/Core";
import { StageImpl } from "@/Stage";
import { assertNullGuarded } from "@/TestUtils";
import { JSDOM } from "jsdom";
import { describe, it } from "mocha";

Properties.setWindow(new JSDOM("<html></html>").window);

describe("Stage tests", () => {

	it("Constructor null argument", () => {
		assertNullGuarded("rootSelector", () => new StageImpl(null));
	});

	it("Constructor null initializer", () => {
		assertNullGuarded("callback", () => new StageImpl("html").withInitializer(null));
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new StageImpl("html").get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new StageImpl("html").get("Invalid id!"), "ValidationError");
	});

	it("setComponentFromRegistry() - null componentName", () => {
		assertNullGuarded("componentName", () => new StageImpl("html").setComponentFromRegistry(null));
	});

});
