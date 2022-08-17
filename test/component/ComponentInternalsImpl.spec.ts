import { assertNullGuarded } from "test/TestUtils";
import { spy, verify } from "ts-mockito";
import Module from 'module/Module';
import ModulesContextImpl from 'module/ModulesContextImpl';
import Component from 'component/Component';
import ComponentInternalsImpl from 'component/ComponentInternalsImpl';
import DomImpl from 'dom/DomImpl';
import InstanceServices from "context/InstanceServices";
import InstanceServicesImpl from "context/InstanceServicesImpl";
import LoggerFactory from "log/LoggerFactory";
import { FilterBuilder } from 'filter/Filter';
import InternalComponentOptions from "component/InternalComponentOptions";

const cydranContext: InstanceServices = new InstanceServicesImpl(new DomImpl(), {});
const module: Module = new ModulesContextImpl(cydranContext).getDefaultModule();
const opts: InternalComponentOptions = { 'module': module };

const template: string = "<div></div>";
class TestComponent extends Component {
	private testItems: string[] = ["Jack", "Jill", "Billy", "Suzy"];
	constructor() {
		super(template);
	}
}
const testComponent: Component = new TestComponent();

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

test.skip("getLoggerFactory(): LoggerFactory", ()=> {
	const specimen: LoggerFactory = cii.getLoggerFactory();
	expect(specimen).not.toBeNull();
});

test.skip("withFilter(): FilterBuilder", ()=> {
	const specimen: FilterBuilder = cii.withFilter("m().testItems");
	expect(specimen).not.toBeNull();
});

test("set/get Data(data: any): void?|any", () => {
	const data = { name1: "bubba", name2: "sally" };
	const spyCii: ComponentInternalsImpl = spy(cii);
	const dataFn: () => any = () => data;
	cii.setItemFn(dataFn);
	verify(spyCii.setItemFn(dataFn)).once();
	expect(data).toEqual(cii.getData());
});
