import ItemComponentFactoryImpl from "behavior/core/each/ItemComponentFactoryImpl";
import ContextImpl from "context/ContextImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import ContextsImpl from "context/ContextsImpl";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import DomWalker from "component/DomWalker";
import ServicesImpl from "service/ServicesImpl";
import Services from "service/Services";
import DomImpl from "dom/DomImpl";
import Dom from "dom/Dom";
import ScopeImpl from "scope/ScopeImpl";

const template: string = "<div></div>";
const prefix: string = "x";
const TEST: string = "test";

const scope: ScopeImpl = new ScopeImpl();

function dom(): Dom {
	return new DomImpl();
}

function servicesInstance(): Services {
	return new ServicesImpl(dom());
}

function walker(): DomWalker {
	return new MvvmDomWalkerImpl(servicesInstance());
}

function contextsInstance(): ContextsImpl {
	return new ContextsImpl(servicesInstance());
}

function properties(): MutableProperties {
	return new PropertiesImpl();
}

function context(): ContextImpl {
	const wkMod: ContextImpl = new ContextImpl(servicesInstance(), walker(), TEST, contextsInstance(), scope, properties());
	return wkMod;
}

let instance: ItemComponentFactoryImpl = null;
beforeEach(() => {
	const wkMod: ContextImpl = context();
	instance = new ItemComponentFactoryImpl(wkMod, template, prefix, null, null);
});

afterEach(() => {
	instance = null;
});

test("Instance is good and ready", () => {
	expect(instance).not.toBeNull();
});

test.skip("create", () => {
	// TODO: not sure how to approach this
	const wkItem: {} = {'id': 12311523, 'value': 'abc'};
	const wkSpy:ItemComponentFactoryImpl = jest.spyOn(instance, 'create');
	instance.create(wkItem);
	expect(wkSpy).toBeCalledTimes(1);
});
