import { JSDOM } from 'jsdom';
import { Nestable, requireNotNull, isDefined, Stage, Context, Type, merge, ArgumentsResolvers, PropertyKeys, Component, create } from "@cydran/cydran";
import { queries, fireEvent } from '@testing-library/dom';
import { expect } from '@jest/globals';
import { Matchers } from 'expect';

class TestComponent extends Component {
	
	constructor() {
		super("<div></div>");
	}

}

const DEFAULT_COMPONENT_SUPPLIER: () => any = () => new TestComponent();

const HTML: string = `<!doctype html>
<html lang="en">
	<head>
		<title>Cydran Test Harness</title>
	</head>
	<body>
		<!-- Stage Content -->
	</body>
</html>`;

interface ExpectionActions {

	selectedValues(): Matchers<any>;

	trimmedTextContent(): Matchers<any>;

	textContent(): Matchers<any>;

}

interface Operations {

	get(options?: any): HTMLElement;

	query(options?: any): HTMLElement;

	find(options?: any): HTMLElement;

	getAll(options?: any): HTMLElement[];

	queryAll(options?: any): HTMLElement[];

	findAll(options?: any): HTMLElement[];

	expect(options?: any): ExpectionActions;

	appendText(text: string, options?: any): void;

	replaceText(text: string, options?: any): void;

	selectIndex(index: number, options?: any): void;

	selectIndexes(indexes: number[], options?: any): void;

	setCheckedState(options?: any): void;

}

class ExpectionActionsImpl implements ExpectionActions {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public selectedValues(): Matchers<any> {
		const selected: string[] = [];

		// eslint:disable-next-line
		for (let i: number = 0; i < this.element["selectedOptions"].length; i++) {
			const option: HTMLOptionElement = this.element["selectedOptions"][i];
			selected.push(option.value);
		}

		return expect(selected);
	}

	public trimmedTextContent(): Matchers<any> {
		return expect(this.element.textContent.trim());
	}

	public textContent(): Matchers<any> {
		return expect(this.element.textContent);
	}

}

class OperationsImpl implements Operations {

	private element: HTMLElement;

	private value: string;

	private type: string;

	constructor(element: HTMLElement, value: string, type: string) {
		this.element = requireNotNull(element, "element");
		this.value = requireNotNull(value, "value");
		this.type = requireNotNull(type, "type");
	}

	public get(options?: any): HTMLElement {
		return this.execute("get", options);
	}

	public query(options?: any): HTMLElement {
		return this.execute("query", options);
	}

	public find(options?: any): HTMLElement {
		return this.execute("find", options);
	}

	public getAll(options?: any): HTMLElement[] {
		return this.execute("getAll", options);
	}

	public queryAll(options?: any): HTMLElement[] {
		return this.execute("queryAll", options);
	}

	public findAll(options?: any): HTMLElement[] {
		return this.execute("findAll", options);
	}

	public expect(options?: any): ExpectionActions {
		const element: HTMLElement = this.get(options);

		return new ExpectionActionsImpl(element);
	}

	public appendText(text: string, options?: any): void {
		const element: HTMLInputElement = this.get(options) as HTMLInputElement;
		element.value = element.value + text;
		fireEvent.input(element);
	}

	public replaceText(text: string, options?: any): void {
		const element: HTMLInputElement = this.get(options) as HTMLInputElement;
		element.value = text;
		fireEvent.input(element);
	}

	public selectIndex(index: number, options?: any): void {
		const element: HTMLSelectElement = this.get(options) as HTMLSelectElement;
		element.selectedIndex = index;
		fireEvent.change(element);
	}

	public selectIndexes(indexes: number[], options?: any): void {
		const element: HTMLSelectElement = this.get(options) as HTMLSelectElement;

		// eslint:disable-next-line
		for (let i: number = 0; i < element.options.length; i++) {
			const option: HTMLOptionElement = element.options[i];
			option.selected = false;
		}

		// eslint:disable-next-line
		for (let i: number = 0; i < indexes.length; i++) {
			const index: number = indexes[i];
			const option: HTMLOptionElement = element.options[index];
			option.selected = true;
		}

		fireEvent.change(element);
	}

	public setCheckedState(value: boolean, options?: any): void {
		const element: HTMLInputElement = this.get(options) as HTMLInputElement;
		element.checked = value;
		fireEvent.input(element);
	}

	private execute<T>(name: string, options: any): T {
		const methodName: string = name + "By" + this.type;

		return queries[methodName](this.element, this.value, options) as T;
	}

}

class Harness<C extends Nestable> {

	private document: Document;

	private window: Window;

	private stage: Stage;

	private rootSupplier: () => C;

	private initialProperties: any;

	private root: C;

	constructor(rootSupplier: () => C = DEFAULT_COMPONENT_SUPPLIER as () => C, properties?: any) {
		this.rootSupplier = requireNotNull(rootSupplier, "rootSupplier");
		const actualProperties: any = isDefined(properties) ? properties : {};
		const defaultProperties: any = {
			[PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS]: true,
			[PropertyKeys.CYDRAN_LOG_LEVEL]: "WARN",
			[PropertyKeys.CYDRAN_OVERRIDE_WINDOW]: this.window
		};

		this.initialProperties = merge([defaultProperties, actualProperties]);
		this.reset();
	}

	public reset(): void {
		this.stop();

		this.window = new JSDOM(HTML).window as unknown as Window;
		this.document = this.window.document;

		this.stage = create("body", this.initialProperties);
		this.stage.addInitializer((stage: Stage) => {
			this.root = this.rootSupplier();
			stage.setComponent(this.root);
		});
	}

	public start(): Harness<C> {
		this.stage.start();

		return this;
	}

	public stop(): Harness<C> {
		if (isDefined(this.stage) && this.stage.isStarted()) {
			this.stage.$release();
		}

		return this;
	}

	public getComponent(): C {
		return this.root;
	}

	public getWindow(): Window {
		return this.window;
	}

	public getDocument(): Document {
		return this.document;
	}

	public getContext(): Context {
		return this.stage.getContext();
	}

	public registerConstant(id: string, instance: any): void {
		this.stage.getContext().registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.stage.getContext().registerPrototype(id, classInstance, resolvers);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.stage.getContext().registerSingleton(id, classInstance, resolvers);
	}

	public forRole(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "Role");
	}

	public forLabelText(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "LabelText");
	}

	public forPlaceholderText(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "PlaceholderText");
	}

	public forText(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "Text");
	}

	public forDisplayValue(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "DisplayValue");
	}

	public forAltText(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "AltText");
	}

	public forTitle(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "Title");
	}

	public forTestId(value: string): Operations {
		return new OperationsImpl(this.document.documentElement, value, "TestId");
	}

}

export default Harness;
