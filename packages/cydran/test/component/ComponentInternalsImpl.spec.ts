import { assertNullGuarded } from "test/TestUtils";
import { Context } from 'context/Context';
import Component from 'component/Component';
import ComponentInternalsImpl from 'component/ComponentInternalsImpl';
import InternalComponentOptions from "component/InternalComponentOptions";
import DomUtils from 'dom/DomUtils';
import { NullValueError } from "error/Errors";
import { JSType, FORM_KEY } from "CydranConstants";
import RegionBehavior from "behavior/core/RegionBehavior";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const context: Context = new GlobalContextImpl();
const opts: InternalComponentOptions = { 'context': context };

const template: string = "<div><p>stuff here</p><!-- comment here --></div>";

class TestComponent extends Component {
	public testItems: string[] = ["Jack", "Jill", "Billy", "Suzy"];
	constructor() {
		super(template);
	}
}

const testComponent: Component = new TestComponent();

const CHANNEL: string = "GOOFY";
const MSG_NAME: string = "DOFFUS";

let cii: ComponentInternalsImpl = null;

describe("ComponentInternalsImpl", () => {

	beforeEach(() => {
		cii = new ComponentInternalsImpl(testComponent, template, opts);
	});

	afterEach(() => {
		cii = null;
	});

	test("new ComponentInternalsImpl - null template", () => {
		assertNullGuarded("template", () => new ComponentInternalsImpl(testComponent, null, null));
	});

	test("new ComponentInternalsImpl() - normal", () => {
		expect(cii).not.toBeNull();
	});

	test("getLogger(): Logger", () => {
		expect(cii.getLogger()).not.toBeNull();
	});

	test("set/get Data(data: any): void?|any", () => {
		const data = { name1: "bubba", name2: "sally" };
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, "setItemFn") as unknown as ComponentInternalsImpl;
		const dataFn: () => any = () => data;
		cii.setItemFn(dataFn);
		expect(spyCii).toHaveBeenNthCalledWith(1, dataFn);
		expect(data).toEqual(cii.getData());
	});

	test("isValidated", () => {
		const validated: boolean = cii.isValidated();
		expect(validated).not.toBeTruthy();
	});

	test("init", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'init') as unknown as ComponentInternalsImpl;
		cii.init();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("initialize", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'initialize') as unknown as ComponentInternalsImpl;
		expect(() => cii.initialize()).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("digest", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'digest') as unknown as ComponentInternalsImpl;
		expect(() => cii.digest()).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("onMount", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'onMount') as unknown as ComponentInternalsImpl;
		expect(() => cii.onMount()).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("onUnmount", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'onUnmount') as unknown as ComponentInternalsImpl;
		expect(() => cii.onUnmount()).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("onRemount", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'onRemount') as unknown as ComponentInternalsImpl;
		expect(() => cii.onRemount()).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("getId", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getId') as unknown as ComponentInternalsImpl;
		const wkId: string = cii.getId();
		expect(spyCii).toHaveBeenCalledTimes(1);
		expect(wkId).not.toBeNull();
	});

	test("getWatchScope", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getWatchScope') as unknown as ComponentInternalsImpl;
		const result: any = cii.getWatchScope();
		expect(spyCii).toHaveBeenCalledTimes(1);
		expect(result).not.toBeNull();
	});

	test("createRegionName", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'createRegionName') as unknown as ComponentInternalsImpl;
		const result: string = cii.createRegionName();
		expect(spyCii).toHaveBeenCalledTimes(1);
		expect(result).not.toBeNull();
	});

	test("getComponent", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getComponent') as unknown as ComponentInternalsImpl;
		const result: Component = cii.getComponent() as Component;
		expect(spyCii).toHaveBeenCalledTimes(1);
		expect(result).not.toBeNull();
	});

	test("isConnected", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'isConnected') as unknown as ComponentInternalsImpl;
		const result: boolean = cii.isConnected();
		expect(spyCii).toHaveBeenCalledTimes(1);
		expect(result).toBe(false);
	});

	test("forElement", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forElement') as unknown as ComponentInternalsImpl;
		expect(() => cii.forElement("ugly-id")).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("forForm - null name", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forForm') as unknown as ComponentInternalsImpl;
		expect(() => cii.forForm(null)).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("forForm - unknown name", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forForm') as unknown as ComponentInternalsImpl;
		expect(() => cii.forForm("ugly-form")).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("forForms", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forForms') as unknown as ComponentInternalsImpl;
		expect(() => cii.forForms()).toThrowError(NullValueError);
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("getModelFn", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getModelFn') as unknown as ComponentInternalsImpl;
		const result: Function = cii.getModelFn();
		expect(result).not.toBeNull();
		expect(typeof result).toEqual(JSType.UND);
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("getModel", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getModel') as unknown as ComponentInternalsImpl;
		const result: any = cii.getModel();
		expect(result).not.toBeNull();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("invoke", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'invoke') as unknown as ComponentInternalsImpl;
		expect(() => cii.invoke("m().testItems", {})).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("mediate", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'mediate') as unknown as ComponentInternalsImpl;
		expect(() => cii.mediate("m().testItems")).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("addRegion", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addRegion') as unknown as ComponentInternalsImpl;
		const regName: string = cii.createRegionName();
		expect(() => cii.addRegion(regName, new RegionBehavior(cii))).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("addBehavior", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addBehavior') as unknown as ComponentInternalsImpl;
		expect(() => cii.addBehavior(new RegionBehavior(cii))).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("addNamedElement", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addNamedElement') as unknown as ComponentInternalsImpl;
		const elName: string = "Wack";
		const inElem: HTMLInputElement = DomUtils.createElement("input");
		inElem.name = elName;
		expect(() => cii.addNamedElement(elName, inElem)).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

	test("addForm", () => {
		const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addForm') as unknown as ComponentInternalsImpl;
		const elName: string = "wack-form";
		const inElem: HTMLFormElement = DomUtils.createElement(FORM_KEY);
		inElem.name = elName;
		expect(() => cii.addForm(inElem)).toThrowError();
		expect(spyCii).toHaveBeenCalledTimes(1);
	});

});
