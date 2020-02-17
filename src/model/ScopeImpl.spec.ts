import ScopeImpl from "@/model/ScopeImpl";
import { assert } from "chai";
import { describe, it, xit } from "mocha";

function initItems(instance: ScopeImpl): void {
	instance.add("add", (value: number) => value + 1);
	instance.add("sub", (value: number) => value - 1);
}

describe("Scope tests", () => {

	it("code generated", () => {
		const instance: ScopeImpl = new ScopeImpl();
		initItems(instance);
		assert.equal(instance.getCode(), "var add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("items registered", () => {
		const instance: ScopeImpl = new ScopeImpl();
		initItems(instance);
		assert.equal(instance.getItems()["add"](42), 43);
		assert.equal(instance.getItems()["sub"](31337), 31336);
	});

	it("items from parent", () => {
		const parent: ScopeImpl = new ScopeImpl();
		const instance: ScopeImpl = new ScopeImpl();
		instance.setParent(parent);
		initItems(instance);
		parent.add("mul", (value: number) => value * 2);
		parent.add("div", (value: number) => value / 2);
		parent.add("mod", (value: number) => value % 2);
		assert.equal(instance.getItems()["add"](42), 43);
		assert.equal(instance.getItems()["sub"](31337), 31336);
		assert.equal(instance.getItems()["mul"](4), 8);
		assert.equal(instance.getItems()["div"](4), 2);
		assert.equal(instance.getItems()["mod"](3), 1);
		assert.equal(instance.getCode(), "var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("items from parent with overrides", () => {
		const parent: ScopeImpl = new ScopeImpl();
		const instance: ScopeImpl = new ScopeImpl();
		instance.setParent(parent);
		initItems(instance);
		parent.add("mul", (value: number) => value * 2);
		parent.add("div", (value: number) => value / 2);
		parent.add("mod", (value: number) => value % 2);
		instance.add("mul", (value: number) => value * 4);
		assert.equal(instance.getItems()["add"](42), 43);
		assert.equal(instance.getItems()["sub"](31337), 31336);
		assert.equal(instance.getItems()["mul"](4), 16);
		assert.equal(instance.getItems()["div"](4), 2);
		assert.equal(instance.getItems()["mod"](3), 1);
		assert.equal(instance.getCode(), "var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("items from parents with overrides", () => {
		const parent0: ScopeImpl = new ScopeImpl();
		const parent1: ScopeImpl = new ScopeImpl();
		const instance: ScopeImpl = new ScopeImpl();
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
		parent1.add("alpha", "ONE");
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

		instance.remove("alpha");

		assert.equal(instance.getItems()["alpha"], "ONE");
		assert.equal(instance.getItems()["beta"], "Two");
		assert.equal(instance.getItems()["gamma"], "Three");
		assert.equal(instance.getItems()["delta"], "Four");
		assert.equal(instance.getItems()["epsilon"], "FIVE");
		assert.equal(instance.getItems()["zeta"], "SIX");
	});

	it("items from parents with overrides", () => {
		const parent0: ScopeImpl = new ScopeImpl();
		const parent1: ScopeImpl = new ScopeImpl();
		const instance: ScopeImpl = new ScopeImpl();
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
		parent1.add("alpha", "ONE");
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

		instance.remove("alpha");

		assert.equal(instance.getItems()["alpha"], "ONE");
		assert.equal(instance.getItems()["beta"], "Two");
		assert.equal(instance.getItems()["gamma"], "Three");
		assert.equal(instance.getItems()["delta"], "Four");
		assert.equal(instance.getItems()["epsilon"], "FIVE");
		assert.equal(instance.getItems()["zeta"], "SIX");
	});

	it("Add valid item", () => {
		const instance: ScopeImpl = new ScopeImpl();

		instance.add("alpha", "One");

		assert.equal(instance.getItems()["alpha"], "One");
	});

	it("Add invalid item", () => {
		const instance: ScopeImpl = new ScopeImpl();
		let thrown = null;

		try {
			instance.add("invalid name", "One");
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "ScopeError");
		assert.equal(thrown.message, "Only objects with names containing letters and numbers and starting with a letter are allowed.");
	});

	it("Add null item", () => {
		const instance: ScopeImpl = new ScopeImpl();
		let thrown = null;

		try {
			instance.add(null, "One");
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "NullValueError");
		assert.equal(thrown.message, "name must not be null or undefined.");
	});

	it("Remove invalid item", () => {
		const instance: ScopeImpl = new ScopeImpl();
		let thrown = null;

		try {
			instance.remove("invalid name");
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "ScopeError");
		assert.equal(thrown.message, "Only objects with names containing letters and numbers and starting with a letter are allowed.");
	});

	it("Remove null item", () => {
		const instance: ScopeImpl = new ScopeImpl();
		let thrown = null;

		try {
			instance.remove(null);
		} catch (e) {
			thrown = e;
		}

		assert.isNotNull(thrown);
		assert.equal(thrown.name, "NullValueError");
		assert.equal(thrown.message, "name must not be null or undefined.");
	});

});
