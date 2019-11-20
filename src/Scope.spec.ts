import { assert } from "chai";
import { describe, it, xit } from "mocha";
import Scope from "./Scope";

function initItems(instance: Scope): void {
	instance.add("add", (value) => value + 1);
	instance.add("sub", (value) => value - 1);
}

describe("Scope tests", () => {

	it("code generated", () => {
		const instance: Scope = new Scope();
		initItems(instance);
		assert.equal(instance.getCode(), "var add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("items registered", () => {
		const instance: Scope = new Scope();
		initItems(instance);
		assert.equal(instance.getItems()["add"](42), 43);
		assert.equal(instance.getItems()["sub"](31337), 31336);
	});

	it("items from parent", () => {
		const parent: Scope = new Scope();
		const instance: Scope = new Scope();
		instance.setParent(parent);
		initItems(instance);
		parent.add("mul", (value) => value * 2);
		parent.add("div", (value) => value / 2);
		parent.add("mod", (value) => value % 2);
		assert.equal(instance.getItems()["add"](42), 43);
		assert.equal(instance.getItems()["sub"](31337), 31336);
		assert.equal(instance.getItems()["mul"](4), 8);
		assert.equal(instance.getItems()["div"](4), 2);
		assert.equal(instance.getItems()["mod"](3), 1);
		assert.equal(instance.getCode(), "var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("items from parent with overrides", () => {
		const parent: Scope = new Scope();
		const instance: Scope = new Scope();
		instance.setParent(parent);
		initItems(instance);
		parent.add("mul", (value) => value * 2);
		parent.add("div", (value) => value / 2);
		parent.add("mod", (value) => value % 2);
		instance.add("mul", (value) => value * 4);
		assert.equal(instance.getItems()["add"](42), 43);
		assert.equal(instance.getItems()["sub"](31337), 31336);
		assert.equal(instance.getItems()["mul"](4), 16);
		assert.equal(instance.getItems()["div"](4), 2);
		assert.equal(instance.getItems()["mod"](3), 1);
		assert.equal(instance.getCode(), "var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("items from parents with overrides", () => {
		const parent0: Scope = new Scope();
		const parent1: Scope = new Scope();
		const instance: Scope = new Scope();
		instance.setParent(parent0);

		instance.add("alpha", "One");
		instance.add("beta", "Two");
		instance.add("gamma", "Three");
		instance.add("delta", "Four");

		assert.equal(instance.getItems()["alpha"], "One");
		assert.equal(instance.getItems()["beta"], "Two");
		assert.equal(instance.getItems()["gamma"], "Three");
		assert.equal(instance.getItems()["delta"], "Four");

		parent0.add("epsilon", "five");
		parent0.add("zeta", "six");
		parent1.add("epsilon", "FIVE");
		parent1.add("zeta", "SIX");

		assert.equal(instance.getItems()["alpha"], "One");
		assert.equal(instance.getItems()["beta"], "Two");
		assert.equal(instance.getItems()["gamma"], "Three");
		assert.equal(instance.getItems()["delta"], "Four");
		assert.equal(instance.getItems()["epsilon"], "five");
		assert.equal(instance.getItems()["zeta"], "six");

		instance.setParent(parent1);

		assert.equal(instance.getItems()["alpha"], "One");
		assert.equal(instance.getItems()["beta"], "Two");
		assert.equal(instance.getItems()["gamma"], "Three");
		assert.equal(instance.getItems()["delta"], "Four");
		assert.equal(instance.getItems()["epsilon"], "FIVE");
		assert.equal(instance.getItems()["zeta"], "SIX");
	});

});
