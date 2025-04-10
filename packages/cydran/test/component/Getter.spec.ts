import { beforeEach, afterEach, test, expect, describe } from "@jest/globals";
import Getter from 'mediator/Getter';
import ScopeImpl from 'scope/ScopeImpl';

import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from 'properties/Property';
import getLogger from 'log/getLogger';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { requireNotNull } from 'util/Utils';

interface Model {

	value: string;

}

let properties: MutableProperties = null;
let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

describe("Getter", () => {

	beforeEach(() => {
		properties = new PropertiesImpl();
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
		expect(new Getter("m().value", getLogger("getter"))).not.toBeNull();
	});

	test("get(scope) - m()", () => {
		const specimen: Getter<string> = new Getter<string>("m().value", getLogger("getter"));
		expect(specimen.get(scope)).toEqual("foo");

		modelInstance.value = "bar";

		expect(specimen.get(scope)).toEqual("bar");
	});

	test("get(scope) - v()", () => {
		const specimen: Getter<string> = new Getter<string>("v().value", getLogger("getter"));
		expect(specimen.get(scope)).toEqual("baz");

		valueInstance.value = "bat";

		expect(specimen.get(scope)).toEqual("bat");
	});

	test("get(scope) - s()", () => {
		const specimen: Getter<string> = new Getter<string>("s().scopeItem", getLogger("getter"));
		expect(specimen.get(scope)).toEqual("Alpha");

		scope.add("scopeItem", "Beta");

		expect(specimen.get(scope)).toEqual("Beta");
	});

	test("get(scope) - u()", () => {
		const specimen: Getter<Object> = new Getter<Object>("u().value", getLogger("getter"));
		expect(specimen.get(scope)).toBeUndefined();
	});

});
