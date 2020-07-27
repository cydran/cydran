import { ScopeImpl } from '@/Component';

function initItems(instance: ScopeImpl): void {
	instance.add("add", (value: number) => value + 1);
	instance.add("sub", (value: number) => value - 1);
}

test("code generated", () => {
	const instance: ScopeImpl = new ScopeImpl();
	initItems(instance);
	expect(instance.getCode()).toEqual("var add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
});

test("items registered", () => {
	const instance: ScopeImpl = new ScopeImpl();
	initItems(instance);
	expect(instance.getItems()["add"](42)).toEqual(43);
	expect(instance.getItems()["sub"](31337)).toEqual(31336);
});

test("items from parent", () => {
	const parent: ScopeImpl = new ScopeImpl();
	const instance: ScopeImpl = new ScopeImpl();
	instance.setParent(parent);
	initItems(instance);
	parent.add("mul", (value: number) => value * 2);
	parent.add("div", (value: number) => value / 2);
	parent.add("mod", (value: number) => value % 2);
	expect(instance.getItems()["add"](42)).toEqual(43);
	expect(instance.getItems()["sub"](31337)).toEqual(31336);
	expect(instance.getItems()["mul"](4)).toEqual(8);
	expect(instance.getItems()["div"](4)).toEqual(2);
	expect(instance.getItems()["mod"](3)).toEqual(1);
	expect(instance.getCode()).toEqual("var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
});

test("items from parent with overrides", () => {
	const parent: ScopeImpl = new ScopeImpl();
	const instance: ScopeImpl = new ScopeImpl();
	instance.setParent(parent);
	initItems(instance);
	parent.add("mul", (value: number) => value * 2);
	parent.add("div", (value: number) => value / 2);
	parent.add("mod", (value: number) => value % 2);
	instance.add("mul", (value: number) => value * 4);
	expect(instance.getItems()["add"](42)).toEqual(43);
	expect(instance.getItems()["sub"](31337)).toEqual(31336);
	expect(instance.getItems()["mul"](4)).toEqual(16);
	expect(instance.getItems()["div"](4)).toEqual(2);
	expect(instance.getItems()["mod"](3)).toEqual(1);
	expect(instance.getCode()).toEqual("var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
});

test("items from parents with overrides", () => {
	const parent0: ScopeImpl = new ScopeImpl();
	const parent1: ScopeImpl = new ScopeImpl();
	const instance: ScopeImpl = new ScopeImpl();
	instance.setParent(parent0);

	instance.add("alpha", "One");
	instance.add("beta", "Two");
	instance.add("gamma", "Three");
	instance.add("delta", "Four");

	expect(instance.getItems()["alpha"]).toEqual("One");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");

	parent0.add("epsilon", "five");
	parent0.add("zeta", "six");
	parent1.add("alpha", "ONE");
	parent1.add("epsilon", "FIVE");
	parent1.add("zeta", "SIX");

	expect(instance.getItems()["alpha"]).toEqual("One");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");
	expect(instance.getItems()["epsilon"]).toEqual("five");
	expect(instance.getItems()["zeta"]).toEqual("six");

	instance.setParent(parent1);

	expect(instance.getItems()["alpha"]).toEqual("One");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");
	expect(instance.getItems()["epsilon"]).toEqual("FIVE");
	expect(instance.getItems()["zeta"]).toEqual("SIX");

	instance.remove("alpha");

	expect(instance.getItems()["alpha"]).toEqual("ONE");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");
	expect(instance.getItems()["epsilon"]).toEqual("FIVE");
	expect(instance.getItems()["zeta"]).toEqual("SIX");
});

test("items from parents with overrides", () => {
	const parent0: ScopeImpl = new ScopeImpl();
	const parent1: ScopeImpl = new ScopeImpl();
	const instance: ScopeImpl = new ScopeImpl();
	instance.setParent(parent0);

	instance.add("alpha", "One");
	instance.add("beta", "Two");
	instance.add("gamma", "Three");
	instance.add("delta", "Four");

	expect(instance.getItems()["alpha"]).toEqual("One");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");

	parent0.add("epsilon", "five");
	parent0.add("zeta", "six");
	parent1.add("alpha", "ONE");
	parent1.add("epsilon", "FIVE");
	parent1.add("zeta", "SIX");

	expect(instance.getItems()["alpha"]).toEqual("One");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");
	expect(instance.getItems()["epsilon"]).toEqual("five");
	expect(instance.getItems()["zeta"]).toEqual("six");

	instance.setParent(parent1);

	expect(instance.getItems()["alpha"]).toEqual("One");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");
	expect(instance.getItems()["epsilon"]).toEqual("FIVE");
	expect(instance.getItems()["zeta"]).toEqual("SIX");

	instance.remove("alpha");

	expect(instance.getItems()["alpha"]).toEqual("ONE");
	expect(instance.getItems()["beta"]).toEqual("Two");
	expect(instance.getItems()["gamma"]).toEqual("Three");
	expect(instance.getItems()["delta"]).toEqual("Four");
	expect(instance.getItems()["epsilon"]).toEqual("FIVE");
	expect(instance.getItems()["zeta"]).toEqual("SIX");
});

test("Add valid item", () => {
	const instance: ScopeImpl = new ScopeImpl();

	instance.add("alpha", "One");

	expect(instance.getItems()["alpha"]).toEqual("One");
});

test("Add invalid item", () => {
	const instance: ScopeImpl = new ScopeImpl();
	let thrown = null;

	try {
		instance.add("invalid name", "One");
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("ScopeError");
	expect(thrown.message).toEqual("Only objects with names containing letters and numbers and starting with a letter are allowed.");
});

test("Add null item", () => {
	const instance: ScopeImpl = new ScopeImpl();
	let thrown = null;

	try {
		instance.add(null, "One");
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("NullValueError");
	expect(thrown.message).toEqual("name must not be null or undefined.");
});

test("Remove invalid item", () => {
	const instance: ScopeImpl = new ScopeImpl();
	let thrown = null;

	try {
		instance.remove("invalid name");
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("ScopeError");
	expect(thrown.message).toEqual("Only objects with names containing letters and numbers and starting with a letter are allowed.");
});

test("Remove null item", () => {
	const instance: ScopeImpl = new ScopeImpl();
	let thrown = null;

	try {
		instance.remove(null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("NullValueError");
	expect(thrown.message).toEqual("name must not be null or undefined.");
});
