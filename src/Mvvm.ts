import View from "./Component";
import ElementDecorator from "./Decorator";
import ClickElementDecorator from "./decorator/ClickDecorator";
import ChangeElementDecorator from "./decorator/ChangeDecorator";
import ValuedModelElementDecorator from "./decorator/ValuedModelDecorator";
import InnerHtmlElementDecorator from "./decorator/InnerHtmlDecorator";
import SelectOptionsElementDecorator from "./decorator/SelectOptionsDecorator";
import DisableableModelElementDecorator from "./decorator/DisableableModelDecorator";
import AttributeElementDecorator from "./decorator/AttributeDecorator";
import KeydownElementDecorator from "./decorator/KeydownDecorator";
import VisibleElementDecorator from "./decorator/VisibleDecorator";
import ComponentEachElementDecorator from "./decorator/ComponentEachDecorator";
import ForceFocusElementDecorator from "./decorator/ForceFocusDecorator";
import FilterInputElementDecorator from "./decorator/FilterInputDecorator";

class Mvvm {

	private static factories: {
		[decoratorType: string]: {
			[tag: string]: {new(): ElementDecorator;};
		}
	} = {};

	private el: HTMLElement;

	private decorators: ElementDecorator[];

	private model: any;

	private parentView: View;

	constructor(model: any) {
		this.decorators = [];
		this.model = model;
	}

	public init(el: HTMLElement, parentView: View): void {
		this.el = el;
		this.parentView = parentView;
		this.populateDecorators();
	}

	private populateDecorators(): void {
		this.processChildren(this.el.children);
	}

	private processChildren(children: HTMLCollection): void {
		for (var i = 0;i < children.length;i++) {
			let el: Element = children[i];
			let attr = el.attributes;

			for (var j = 0;j < attr.length;j++) {
				if (attr[j].name.indexOf('data-v-') == 0) {
					let decoratorType: string = attr[j].name.substr('data-v-'.length);
					this.addDecorator(el.tagName.toLowerCase(), decoratorType, attr[j].value, <HTMLElement>el);
				}
			}

			this.processChildren(el.children);
		}
	}

	private addDecorator(tag: string, decoratorType: string, attributeValue: string, el: HTMLElement) {
		let tags: {[tag: string]: {new(): ElementDecorator;};} = Mvvm.factories[decoratorType];

		let decorator: ElementDecorator = null;

		if (!tags) {
			console.log("Unsupported decorator type: " + decoratorType + ".");
			return;
		}

		let decoratorClass: any = tags[tag];

		if (!decoratorClass) {
			decoratorClass = tags['*'];
		}

		if (!decoratorClass) {
			console.log("Unsupported tag: " + tag + " for decorator " + decoratorType + ".");
			return;
		}

		decorator = new decoratorClass(this, this.parentView, el, attributeValue, this.model);

		this.decorators.push(decorator);
	}

	public dispose(): void {
		for (var i = 0;i < this.decorators.length;i++) {
			this.decorators[i].dispose();
		}

		this.decorators = null;
		this.model = null;
		this.parentView = null;
	}

	public evaluateModel(): void {
		for (var i = 0;i < this.decorators.length;i++) {
			this.decorators[i].evaluateModel();
		}
	}

	public $apply(fn: Function, ...args: any[]): any {
		let result: any = fn.apply(this.model, args);
		this.evaluateModel();

		return result;
	}

	public static register(name: string, supportedTags: string[], elementDecoratorClass: any): void {
		if (!Mvvm.factories[name]) {
			Mvvm.factories[name] = {};
		}

		for (var i = 0;i < supportedTags.length;i++) {
			let supportedTag: string = supportedTags[i];
			Mvvm.factories[name][supportedTag] = elementDecoratorClass;
		}
	}

}

Mvvm.register('click', ['*'], ClickElementDecorator);
Mvvm.register('change', ['*'], ChangeElementDecorator);
Mvvm.register('model', ['input', 'select'], ValuedModelElementDecorator);
Mvvm.register('model', ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], InnerHtmlElementDecorator);
Mvvm.register('options-model', ['select'], SelectOptionsElementDecorator);
Mvvm.register('enabled', ['select', 'input', 'textarea', 'button'], DisableableModelElementDecorator);
Mvvm.register('attribute', ['*'], AttributeElementDecorator);
Mvvm.register('keydown', ['*'], KeydownElementDecorator);
Mvvm.register('visible', ['*'], VisibleElementDecorator);
Mvvm.register('component-each', ['*'], ComponentEachElementDecorator);
Mvvm.register('force-focus', ['*'], ForceFocusElementDecorator);
Mvvm.register('filter', ['input', 'textarea'], FilterInputElementDecorator);

export default Mvvm;