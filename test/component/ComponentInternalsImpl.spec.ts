import Component from "@/component/Component";
import { ComponentConfig, ComponentConfigImpl } from "@/component/ComponentConfig";
import ComponentInternalsImpl from "@/component/ComponentInternalsImpl";
import Logger from "@/logger/Logger";
import { assertNullGuarded } from "@/util/TestUtils";

import { instance, mock, spy, verify } from "ts-mockito";
import ModulesContextImpl from "@/module/ModulesContextImpl";
import Module from "@/module/Module";
import { MODULE_FIELD_NAME } from "@/constant/Constants";

const module: Module = new ModulesContextImpl().getDefaultModule();
const mockComponent: Component = instance(mock(Component));
const cConfig: ComponentConfig = new ComponentConfigImpl();
const template: string = "<div></div>";
mockComponent[MODULE_FIELD_NAME] = module;

function getNewCII() {
	return new ComponentInternalsImpl(mockComponent, template, cConfig);
}

test("new ComponentInternalsImpl - null template", () => {
	assertNullGuarded("template", () => new ComponentInternalsImpl(mockComponent, null, cConfig));
});

test("new ComponentInternalsImpl() - normal", () => {
	const cii: ComponentInternalsImpl = getNewCII();
	expect(cii).not.toBeNull();
});

test("getLogger(): Logger", () => {
	const logr: Logger = getNewCII().getLogger();
	expect(logr).not.toBeNull();
});

test("set/get Data(data: any): void?|any", () => {
	const data = { name1: "bubba", name2: "sally" };
	const cii: ComponentInternalsImpl = getNewCII();
	const spyCii: ComponentInternalsImpl = spy(cii);
	const dataFn: () => any = () => data;
	cii.setItemFn(dataFn);
	verify(spyCii.setItemFn(dataFn)).once();
	expect(data).toEqual(cii.getData());
});
