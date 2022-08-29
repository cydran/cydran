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
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;
let scopeInstance: Model = null as unknown as Model;
let utilitiesInstance: Model = null as unknown as Model;
let specimen: Invoker = null;

beforeEach(() => {
	properties = new PropertiesImpl();
	properties.load(PROPS);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
	scope.add("callable", function(value: string) {
		scopeInstance.value = value;
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

	scopeInstance = {
		value: "biz"
	} as Model;

	specimen = new Invoker(scope, utilitiesInstance);
});

afterEach(() => {
	modelInstance = null as unknown as Model;
	valueInstance = null as unknown as Model;
	utilitiesInstance = null as unknown as Model;
	scopeInstance = null as unknown as Model;
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
	expect(scopeInstance.value).toEqual("biz");
	specimen.invoke("s().callable(p().value)", { value: "fin" });
	expect(scopeInstance.value).toEqual("fin");
});

test("invoke(expression, params) - u()", () => {
	expect(utilitiesInstance.value).toEqual("fiz");
	specimen.invoke("u().callable(p().value)", { value: "bin" });
	expect(utilitiesInstance.value).toEqual("bin");
});

