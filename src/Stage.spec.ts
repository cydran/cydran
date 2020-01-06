import { Properties } from "@/Core";
import Stage from "@/Stage";
import { assertNullGuarded } from "@/TestUtils";
import { JSDOM } from "jsdom";
import { describe, it } from "mocha";

Properties.setWindow(new JSDOM("<html></html>").window);

describe("Stage tests", () => {

	it("Constructor null argument", () => {
		assertNullGuarded("rootSelector", () => new Stage(null));
	});

	it("Constructor null initializer", () => {
		assertNullGuarded("callback", () => new Stage("html").withInitializer(null));
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new Stage("html").get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new Stage("html").get("Invalid id!"), "ValidationError");
	});

	it("setComponentFromRegistry() - null componentName", () => {
		assertNullGuarded("componentName", () => new Stage("html").setComponentFromRegistry(null));
	});

});
