import { DOMWindow, JSDOM } from 'jsdom';
import { builder, Component, requireNotNull, Stage } from "cydran";
import { Matcher, NormalizerFn, queries } from '@testing-library/dom';
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

const PROPERTIES: any = {
	"cydran.startup.synchronous": true
};

interface ExpectionTargets {

	textContext(): Matchers<any,any>;

}

interface Operations {

	get(options?: any): HTMLElement;

	query(options?: any): HTMLElement;

	find(options?: any): HTMLElement;

	getAll(options?: any): HTMLElement[];

	queryAll(options?: any): HTMLElement[];

	findAll(options?: any): HTMLElement[];

	expect(options?: any): ExpectionTargets;

}

class ExpectionTargetsImpl implements ExpectionTargets {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public textContext(): Matchers<any, any> {
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

	private execute<T>(name: string, options: any): T {
		const methodName: string = name + "By" + this.type;
		return queries[methodName](this.element, this.value, options) as T;
	}

}

class Harness<C extends Component> {

	private document: Document;

	private window: DOMWindow;

	private stage: Stage;

	private rootSupplier: () => C;

	private root: C;

	constructor(rootSupplier: () => C) {
		this.rootSupplier = requireNotNull(rootSupplier, "rootSupplier");
		this.window = new JSDOM(HTML).window;
		this.document = this.window.document;
		this.stage = builder("body", this.window)
		.withProperties(PROPERTIES)
		.withInitializer((stage: Stage) => {
			this.root = this.rootSupplier();
			stage.setComponent(this.root);
		})
		.build();
		this.stage.start();
	}

	public getComponent(): C {
		return this.root;
	}

	public getWindow(): DOMWindow {
		return this.window;
	}

	public getDocument(): Document {
		return this.document;
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
