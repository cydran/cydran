import { mock, instance } from "ts-mockito";
import { beforeAll, test, expect, jest } from "@jest/globals";
import Context from "context/Context";
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from "argument/resolver/ConstantArgumentResolver";
import { Properties } from 'properties/Property';
import Registry from 'registry/Registry';
import PropertiesImpl from 'properties/PropertiesImpl';
import RegistryImpl from 'registry/RegistryImpl';
import GlobalContextImpl from 'context/GlobalContextImpl';

let wkContext: Context = new GlobalContextImpl().createChild();
let properties: Properties = null;
let registry: Registry = null;

beforeAll(() => {
	const mockProperties: PropertiesImpl = mock(PropertiesImpl);
	properties = instance(mockProperties);

	const mockRegistry: RegistryImpl = mock(RegistryImpl);
	registry = instance(mockRegistry);
});

test("specimen is whole", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen).not.toBeNull();
});

test("disposal occurs", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen.resolve(wkContext).length).toEqual(0);
	const count: number = 4;
	for(let x: number = 0; x < count; x++) {
		specimen.add(new ConstantArgumentResolver(x));
	}
	expect(specimen.resolve(wkContext).length).toEqual(count);
	specimen.$dispose();
	expect(specimen.resolve(wkContext).length).toEqual(0);
});

test("add and postProcess", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen.resolve(wkContext).length).toEqual(0);
	const targetObject: Object = {};
	let params: string[] = new Array<string>(0);
	specimen.postProcess(wkContext, targetObject, params);

	const count: number = 4;
	const rSpies: any[] = new Array<any>(count);
	params = new Array<string>(0);

	for(let x: number = 0; x < count; x++) {
		const r: ConstantArgumentResolver = new ConstantArgumentResolver(x);
		rSpies[x] = jest.spyOn(r, 'postProcess');
		specimen.add(r);
		params[x] = x + "";
	}

	expect(specimen.resolve(wkContext, properties, registry, wkContext).length).toEqual(count);
	specimen.postProcess(wkContext, properties, registry, targetObject, params);

	for(const wkSpy of rSpies) {
		expect(wkSpy).toBeCalledTimes(1);
	}

});

test("resolve", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen.resolve(wkContext).length).toEqual(0);
	const count: number = 4;

	for(let x: number = 0; x < count; x++) {
		specimen.add(new ConstantArgumentResolver(x));
	}
	const argArray: any[] = specimen.resolve(wkContext);
	expect(argArray.length).toEqual(count);
	for(let x: number = 0; x < count; x++) {
		expect(argArray[x]).toEqual(x);
	}
});
