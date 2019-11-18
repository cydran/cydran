import { assert } from "chai";
import { describe, it, xit } from "mocha";
import Filters from "./Filters";

function initFilters(filters: Filters): void {
	filters.registerFilter("add", (value) => value + 1);
	filters.registerFilter("sub", (value) => value - 1);
}

describe("Filters tests", () => {

	it("code generated", () => {
		const instance: Filters = new Filters();
		initFilters(instance);
		assert.equal(instance.getCode(), "var add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
		assert.equal(instance.getVersion(), "0-0-2");
	});

	it("filters registered", () => {
		const instance: Filters = new Filters();
		initFilters(instance);
		assert.equal(instance.getFilters()["add"](42), 43);
		assert.equal(instance.getFilters()["sub"](31337), 31336);
		assert.equal(instance.getVersion(), "0-0-2");
	});

	it("filters from parent", () => {
		const parent: Filters = new Filters();
		const instance: Filters = new Filters(parent);
		initFilters(instance);
		parent.registerFilter("mul", (value) => value * 2);
		parent.registerFilter("div", (value) => value / 2);
		parent.registerFilter("mod", (value) => value % 2);
		assert.equal(instance.getFilters()["add"](42), 43);
		assert.equal(instance.getFilters()["sub"](31337), 31336);
		assert.equal(instance.getFilters()["mul"](4), 8);
		assert.equal(instance.getFilters()["div"](4), 2);
		assert.equal(instance.getFilters()["mod"](3), 1);
		assert.equal(parent.getVersion(), "0-0-3");
		assert.equal(instance.getVersion(), "0-0-2");
		assert.equal(instance.getCode(), "var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});

	it("filters from parent with overrides", () => {
		const parent: Filters = new Filters();
		const instance: Filters = new Filters(parent);
		initFilters(instance);
		parent.registerFilter("mul", (value) => value * 2);
		parent.registerFilter("div", (value) => value / 2);
		parent.registerFilter("mod", (value) => value % 2);
		instance.registerFilter("mul", (value) => value * 4);
		assert.equal(instance.getFilters()["add"](42), 43);
		assert.equal(instance.getFilters()["sub"](31337), 31336);
		assert.equal(instance.getFilters()["mul"](4), 16);
		assert.equal(instance.getFilters()["div"](4), 2);
		assert.equal(instance.getFilters()["mod"](3), 1);
		assert.equal(parent.getVersion(), "0-0-3");
		assert.equal(instance.getVersion(), "0-0-3");
		assert.equal(instance.getCode(), "var mul = arguments[0][\'mul\'];\nvar div = arguments[0][\'div\'];\nvar mod = arguments[0][\'mod\'];\nvar add = arguments[0][\'add\'];\nvar sub = arguments[0][\'sub\'];\n");
	});






});
