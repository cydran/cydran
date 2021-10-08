import { assertNullGuarded } from "TestUtils";
import { instance, mock, spy, verify } from "ts-mockito";
import Module from 'module/Module';
import ModulesContextImpl from 'module/ModulesContextImpl';
import Component from 'component/Component';
import { MODULE_FIELD_NAME } from 'Constants';
import ComponentInternalsImpl from 'component/ComponentInternalsImpl';

const module: Module = new ModulesContextImpl().getDefaultModule();
const mockComponent: Component = instance(mock(Component));
const template: string = "<div></div>";
mockComponent[MODULE_FIELD_NAME] = module;

function getNewCII() {
	return new ComponentInternalsImpl(mockComponent, template, null);
}

test("new ComponentInternalsImpl - null template", () => {
	assertNullGuarded("template", () => new ComponentInternalsImpl(mockComponent, null, null));
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
