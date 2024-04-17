import { beforeEach, afterEach, test, expect } from "@jest/globals";
import Getter from 'mediator/Getter';
import ScopeImpl from 'scope/ScopeImpl';

import PROPS from "../logger/loggerTestProps.json";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";

interface Model {

	value: string;

}

let properties: Properties = null;
let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;

beforeEach(() => {
	properties = new PropertiesAlternativeImpl();
	properties.load(PROPS);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
	scope.add("scopeItem", "Alpha");

	modelInstance = {
		value: "foo"
	};

	valueInstance = {
		value: "baz"
	};
});

afterEach(() => {
	modelInstance = null as unknown as Model;
	valueInstance = null as unknown as Model;
	properties = null;
});

test("new Getter", () => {
	expect(new Getter("m().value", LoggerFactory.getLogger("Getter"))).not.toBeNull();
});

test("get(scope) - m()", () => {
	const specimen: Getter = new Getter("m().value", LoggerFactory.getLogger("Getter"));
	expect(specimen.get(scope)).toEqual("foo");

	modelInstance.value = "bar";

	expect(specimen.get(scope)).toEqual("bar");
});

test("get(scope) - v()", () => {
	const specimen: Getter = new Getter("v().value", LoggerFactory.getLogger("Getter"));
	expect(specimen.get(scope)).toEqual("baz");

	valueInstance.value = "bat";

	expect(specimen.get(scope)).toEqual("bat");
});

test("get(scope) - s()", () => {
	const specimen: Getter = new Getter("s().scopeItem", LoggerFactory.getLogger("Getter"));
	expect(specimen.get(scope)).toEqual("Alpha");

	scope.add("scopeItem", "Beta");

	expect(specimen.get(scope)).toEqual("Beta");
});

test("get(scope) - u()", () => {
	const specimen: Getter = new Getter("u().value", LoggerFactory.getLogger("Getter"));
	expect(specimen.get(scope)).toBeUndefined();
});
