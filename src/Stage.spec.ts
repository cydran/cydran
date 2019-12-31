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

	it("Constructor null get id", () => {
		assertNullGuarded("id", () => new Stage("html").get(null));
	});

});
