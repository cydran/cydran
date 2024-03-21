import { assertNullGuarded } from "test/TestUtils";
import Context from 'context/Context';
import Component from 'component/Component';
import ComponentInternalsImpl from 'component/ComponentInternalsImpl';
import { FilterBuilder } from 'filter/Filter';
import InternalComponentOptions from "component/InternalComponentOptions";
import DomUtils from 'dom/DomUtils';
import { NullValueError } from "error/Errors";
import JSType from "const/JSType";
import RegionBehavior from "behavior/core/RegionBehavior";
import GlobalContextImpl from 'context/GlobalContextImpl';

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

test.skip("withFilter(): FilterBuilder", ()=> {
	const specimen: FilterBuilder = cii.withFilter("m().testItems");
	expect(specimen).not.toBeNull();
});

test("set/get Data(data: any): void?|any", () => {
	const data = { name1: "bubba", name2: "sally" };
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, "setItemFn");
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
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'init');
	cii.init();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("initialize", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'initialize');
	expect(() => cii.initialize()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("initScope", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'initScope');
	expect(() => cii.initScope()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("digest", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'digest');
	expect(() => cii.digest()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("onMount", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'onMount');
	expect(() => cii.onMount()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("onUnmount", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'onUnmount');
	expect(() => cii.onUnmount()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("onRemount", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'onRemount');
	expect(() => cii.onRemount()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getId", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getId');
	const wkId: string = cii.getId();
	expect(spyCii).toHaveBeenCalledTimes(1);
	expect(wkId).not.toBeNull();
});

test("getWatchScope", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getWatchScope');
	const result: any = cii.getWatchScope();
	expect(spyCii).toHaveBeenCalledTimes(1);
	expect(result).not.toBeNull();
});

test("requestDigestionSources", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'requestDigestionSources');
	expect(() => cii.requestDigestionSources()).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("createRegionName", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'createRegionName');
	const result: string = cii.createRegionName();
	expect(spyCii).toHaveBeenCalledTimes(1);
	expect(result).not.toBeNull();
});

test("setEl/getEl", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'setEl');
	const result: Element = DomUtils.createElement("div");
	cii.setEl(result);
	expect(spyCii).toHaveBeenCalledTimes(1);
	expect(cii.getEl()).not.toBeNull();
	expect(cii.getEl()).toEqual(result);
});

test("getRegion - with null", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getRegion');
	expect(() => cii.getRegion(null)).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getRegion - with name", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getRegion');
	expect(() => cii.getRegion("name")).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getOptions", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getOptions');
	expect(() => cii.getOptions()).not.toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getComponent", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getComponent');
	const result: Component = cii.getComponent();
	expect(spyCii).toHaveBeenCalledTimes(1);
	expect(result).not.toBeNull();
});

test("isConnected", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'isConnected');
	const result: boolean = cii.isConnected();
	expect(spyCii).toHaveBeenCalledTimes(1);
	expect(result).toBe(false);
});

test("forElement", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forElement');
	expect(() => cii.forElement("ugly-id")).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("forForm - null name", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forForm');
	expect(() => cii.forForm(null)).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("forForm - unknown name", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forForm');
	expect(() => cii.forForm("ugly-form")).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("forForms", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'forForms');
	expect(() => cii.forForms()).toThrowError(NullValueError);
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getModelFn", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getModelFn');
	const result: Function = cii.getModelFn();
	expect(result).not.toBeNull();
	expect(typeof result).toEqual(JSType.UND);
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getItemFn", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getItemFn');
	const result: Function = cii.getItemFn();
	expect(result).not.toBeNull();
	expect(typeof result).toEqual(JSType.UND);
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getModel", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getModel');
	const result: any = cii.getModel();
	expect(result).not.toBeNull();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("getMessagables", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'getMessagables');
	const result: any = cii.getMessagables();
	expect(result).not.toBeNull();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("invoke", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'invoke');
	expect(() => cii.invoke("m().testItems")).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("mediate", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'mediate');
	expect(() => cii.mediate("m().testItems")).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("addRegion", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addRegion');
	const regName: string = cii.createRegionName();
	expect(() => cii.addRegion(regName, new RegionBehavior(cii))).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("addBehavior", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addBehavior');
	expect(() => cii.addBehavior(new RegionBehavior(cii))).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("addNamedElement", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addNamedElement');
	const elName: string = "Wack";
	const inElem: HTMLInputElement = DomUtils.createElement("input");
	inElem.name = elName;
	expect(() => cii.addNamedElement(elName, inElem)).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});

test("addForm", () => {
	const spyCii: ComponentInternalsImpl = jest.spyOn(cii, 'addForm');
	const elName: string = "wack-form";
	const inElem: HTMLInputElement = DomUtils.createElement("form");
	inElem.name = elName;
	expect(() => cii.addForm(inElem)).toThrowError();
	expect(spyCii).toHaveBeenCalledTimes(1);
});