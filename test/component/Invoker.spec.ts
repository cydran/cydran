import { mock, spy, verify } from "ts-mockito";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import Invoker from 'mediator/Invoker';

interface Model {

	value: string;

}

let properties: Properties = null;
let scope: ScopeImpl = null;
let modelInstance: Model = null;
let valueInstance: Model = null;
let scopeTarget: Model = null;
let utilitiesInstance: Model = null;
let specimen: Invoker = null;

beforeEach(() => {
	properties = new PropertiesImpl();
	properties.load(PROPS);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
	scope.add("callable", function(value: string) {
		scopeTarget.value = value;
	}
);

	modelInstance = {
		callable: function(value: string) {
			this.value = value;
		},
		value: "foo"
	} as Model;

	valueInstance = {
		callable: function(value: string) {
			this.value = value;
		},
		value: "baz"
	} as Model;

	utilitiesInstance = {
		callable: function(value: string) {
			this.value = value;
		},
		value: "fiz"
	} as Model;

	scopeTarget = {
		value: "biz"
	} as Model;

	specimen = new Invoker(scope, utilitiesInstance);
});

afterEach(() => {
	modelInstance = null;
	valueInstance = null;
	utilitiesInstance = null;
	scopeTarget = null;
	properties = null;
	scope = null;
	specimen = null;
});

test("new Invoker", () => {
	expect(new Invoker(scope)).not.toBeNull();
});

test("invoke(expression, params) - m()", () => {
	expect(modelInstance.value).toEqual("foo");
	specimen.invoke("m().callable(p().value)", { value: "bar" });
	expect(modelInstance.value).toEqual("bar");
});

test("invoke(expression, params) - v()", () => {
	expect(valueInstance.value).toEqual("baz");
	specimen.invoke("v().callable(p().value)", { value: "bat" });
	expect(valueInstance.value).toEqual("bat");
});

test("invoke(expression, params) - s()", () => {
	expect(scopeTarget.value).toEqual("biz");
	specimen.invoke("s().callable(p().value)", { value: "fin" });
	expect(scopeTarget.value).toEqual("fin");
});

test("invoke(expression, params) - u()", () => {
	expect(utilitiesInstance.value).toEqual("fiz");
	specimen.invoke("u().callable(p().value)", { value: "bin" });
	expect(utilitiesInstance.value).toEqual("bin");
});

