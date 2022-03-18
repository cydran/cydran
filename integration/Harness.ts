import { JSDOM } from 'jsdom';
import { builder, Nestable, requireNotNull, isDefined, Stage, Module, Type, merge, ArgumentsResolvers, PropertyKeys, Level } from "cydran";
import { Matcher, NormalizerFn, queries, fireEvent } from '@testing-library/dom';
import { expect } from '@jest/globals';
import { Matchers } from 'expect';

const HTML: string = `<!doctype html>
<html lang="en">
	<head>
		<title>Cydran Test Harness</title>
	</head>
	<body>
		<!-- Stage Content -->
	</body>
</html>`;

interface ExpectionTargets {

	selectedValues(): Matchers<any, any>;

	trimmedTextContent(): Matchers<any,any>;

	textContent(): Matchers<any,any>;

}

interface Operations {

	get(options?: any): HTMLElement;

	query(options?: any): HTMLElement;

	find(options?: any): HTMLElement;

	getAll(options?: any): HTMLElement[];

	queryAll(options?: any): HTMLElement[];

	findAll(options?: any): HTMLElement[];

	expect(options?: any): ExpectionTargets;

	appendText(text: string, options?: any): void;

	replaceText(text: string, options?: any): void;

	selectIndex(index: number, options?: any): void;

	selectIndexes(indexes: number[], options?: any): void;

	setCheckedState(options?: any): void

}

class ExpectionTargetsImpl implements ExpectionTargets {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public selectedValues(): Matchers<any, any> {
		const selected: string[] = [];

		// tslint:disable-next-line
		for (let i: number = 0; i < this.element.selectedOptions.length; i++) {
			const option: HTMLOptionElement = this.element.selectedOptions[i];
			selected.push(option.value);
		}

		return expect(selected);
	}

	public trimmedTextContent(): Matchers<any, any> {
		return expect(this.element.textContent.trim());
	}

	public textContent(): Matchers<any, any> {
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

	public expect(options?: any): ExpectionTargets {
		const element: HTMLElement = this.get(options);

		return new ExpectionTargetsImpl(element);
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

		// tslint:disable-next-line
		for (let i: number = 0; i < element.options.length; i++) {
			const option: HTMLOptionElement = element.options[i];
			option.selected = false;
		}

		// tslint:disable-next-line
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

	private root: C;

	constructor(rootSupplier: () => C, properties?: any) {
		this.rootSupplier = requireNotNull(rootSupplier, "rootSupplier");
		this.window = new JSDOM(HTML).window as unknown as Window;
		this.document = this.window.document;
		const actualProperties: any = isDefined(properties) ? properties : {};
		const defaultProperties: any = {
			[PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS]: true,
			[PropertyKeys.CYDRAN_LOG_LEVEL]: Level[Level.WARN],
			[PropertyKeys.CYDRAN_OVERRIDE_WINDOW]: this.window
		};

		const fullProperties: any = merge([defaultProperties, actualProperties]);
		this.stage = builder("body", fullProperties)
			.withInitializer((stage: Stage) => {
				this.root = this.rootSupplier();
				stage.setComponent(this.root);
			})
			.build();
	}

	public start(): Harness<C> {
		this.stage.start();

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

	public getDefaultModule(): Module {
		return this.stage.getDefaultModule();
	}

	public registerConstant(id: string, instance: any): void {
		this.stage.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.stage.registerPrototype(id, classInstance, resolvers);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.stage.registerSingleton(id, classInstance, resolvers);
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
