import { assert } from "chai";
import { JSDOM } from "jsdom";
import { describe, it } from "mocha";
import { Properties } from "@/Core";
import Stage from "@/Stage";

Properties.setWindow(new JSDOM("<html></html>").window);

describe("Stage tests", () => {

	it("Constructor null argument", () => {
		let thrown = null;

		try {
			const specimen: Stage = new Stage(null);
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "NullValueError");
		assert.equal(thrown.message, "rootSelector shall not be null");
	});

	it("Constructor null initializer", () => {
		let thrown = null;

		try {
			new Stage("html").withInitializer(null);
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "NullValueError");
		assert.equal(thrown.message, "callback shall not be null");
	});

	it("Constructor null get id", () => {
		let thrown = null;

		try {
			new Stage("html").get(null);
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "NullValueError");
		assert.equal(thrown.message, "id shall not be null");
	});

});
