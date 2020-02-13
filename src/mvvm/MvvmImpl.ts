import ObjectUtils from "@/ObjectUtils";
import Mvvm from "@/mvvm/Mvvm";
import Logger from "@/logger/Logger";
import Region from "@/Region";
import LoggerFactory from "@/logger/LoggerFactory";
import GuardGenerator from "@/GuardGenerator";
import ScopeImpl from "@/ScopeImpl";
import { INTERNAL_DIRECT_CHANNEL_NAME, TEXT_NODE_TYPE } from "@/Constants";
import ModelMediatorImpl from "@/ModelMediatorImpl";
import ModelMediator from "@/ModelMediator";
import DigestionContextImpl from "@/DigestionContextImpl";
import DigestionContext from "@/DigestionContext";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import Module from "@/Module";
import ElementMediator from "@/mediator/ElementMediator";
import ComponentInternals from "@/ComponentInternals";
import Component from "@/Component";
import TemplateError from "@/error/TemplateError";
import Modules from "@/Modules";
import ExternalAttributeDetail from "@/ExternalAttributeDetail";
import Properties from "@/Properties";
import TextElementMediator from "@/mediator/TextElementMediator";
import EventElementMediator from "@/mediator/EventElementMediator";
import AttributeElementMediator from "@/mediator/AttributeElementMediator";

const requireNotNull = ObjectUtils.requireNotNull;

class MvvmImpl implements Mvvm {

	public static register(name: string, supportedTags: string[], elementMediatorClass: any): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(elementMediatorClass, "elementMediatorClass");

		if (!MvvmImpl.factories[name]) {
			MvvmImpl.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			MvvmImpl.factories[name][supportedTag] = elementMediatorClass;
		}
	}

	private static factories: {
		[elementMediatorType: string]: {
			[tag: string]: new () => ElementMediator<any, HTMLElement, any>;
		}
	} = {};

	private logger: Logger;

	private el: HTMLElement;

	private elementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private propagatedElementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private mediators: ModelMediatorImpl<any>[];

	private model: any;

	private parent: ComponentInternals;

	private moduleInstance: Module;

	private elementMediatorPrefix: string;

	private eventElementMediatorPrefix: string;

	private externalAttributePrefix: string;

	private regionPrefix: string;

	private componentPrefix: string;

	private components: Component[];

	private scope: ScopeImpl;

	private guard: string;

	private regionLookupFn: (name: string) => Region;

	private modelFn: () => any;

	private itemFn: () => any;

	private externalFn: () => any;

	constructor(model: any, moduleInstance: Module, prefix: string, scope: ScopeImpl, parentModelFn: () => any) {
		this.elementMediatorPrefix = prefix + ":";
		this.eventElementMediatorPrefix = prefix + ":on";
		this.externalAttributePrefix = prefix + ":property-";
		this.regionPrefix = prefix + ":region";
		this.componentPrefix = prefix + ":component";
		this.logger = LoggerFactory.getLogger("Mvvm");
		this.guard = GuardGenerator.INSTANCE.generate();
		this.propagatedElementMediators = [];
		this.scope = new ScopeImpl(false);
		this.scope.setParent(scope);
		this.elementMediators = [];
		this.mediators = [];
		this.model = model;
		this.moduleInstance = moduleInstance;
		this.components = [];

		const localModelFn: () => any = () => this.model;
		this.modelFn = parentModelFn ? parentModelFn : localModelFn;
		this.itemFn = () => this.parent.getData();
		this.externalFn = () => this.parent.getExternalCache();

		this.scope.add("m", this.modelFn);
		this.scope.add("model", this.modelFn);
		this.scope.add("i", this.itemFn);
		this.scope.add("item", this.itemFn);
		this.scope.add("e", this.externalFn);
		this.scope.add("external", this.externalFn);
	}

	public init(el: HTMLElement, parent: ComponentInternals, regionLookupFn: (name: string) => Region): void {
		this.el = el;
		this.parent = parent;
		this.regionLookupFn = regionLookupFn;
		this.validateEl();
		this.populateElementMediators();
	}

	public enableGlobal(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.message(INTERNAL_DIRECT_CHANNEL_NAME, "enableGlobal");
		}
	}

	public disableGlobal(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.message(INTERNAL_DIRECT_CHANNEL_NAME, "disableGlobal");
		}
	}

	public dispose(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.dispose();
		}

		this.elementMediators = [];
		this.components = [];

		for (const component of this.components) {
			component.dispose();
		}

		this.parent = null;
	}

	public getGuard(): string {
		return this.guard;
	}

	public mediate<T>(expression: string): ModelMediator<T> {
		const mediator: ModelMediator<T> = new ModelMediatorImpl<T>(this.model, expression, this.scope);
		this.mediators.push(mediator as ModelMediatorImpl<any>);

		return mediator;
	}

	public digest(): void {
		const context: DigestionContext = new DigestionContextImpl();
		context.add(this.guard, this.mediators);

		for (const propagatedElementMediator of this.propagatedElementMediators) {
			propagatedElementMediator.requestMediators(context);
		}

		context.digest();
	}

	public $apply(fn: Function, args: any[]): any {
		let result: any = null;

		this.parent.importExternals();

		try {
			result = fn.apply(this.model, args);
			this.digest();
		} finally {
			this.parent.exportExternals();
		}

		this.parent.message(INTERNAL_DIRECT_CHANNEL_NAME, "propagateDigest", null);

		for (const component of this.components) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", null);
		}

		return result;
	}

	public getModelFn(): () => any {
		return this.modelFn;
	}

	public getItemFn(): () => any {
		return this.itemFn;
	}

	public getExternalFn(): () => any {
		return this.externalFn;
	}

	private validateEl(): void {
		if (this.el.tagName.toLowerCase() === this.componentPrefix.toLowerCase()) {
			throw new TemplateError("Templates must not have a component tag as the top level tag.");
		}
	}

	private populateElementMediators(): void {
		const queue: HTMLElement[] = [this.el];

		while (queue.length > 0) {
			this.processChild(queue);
		}
	}

	private processChild(queue: HTMLElement[]): void {
		const el: HTMLElement = queue.pop();
		const EVT_NAME_ERR = "Event expressor \'%eventName%\' MUST correspond to a valid event in the target environment: \'";
		const regex = /^[A-Za-z]+$/;
		const elName: string = el.tagName.toLowerCase();

		if (elName === this.regionPrefix) {
			const regionName: string = el.getAttribute("name");
			const region: Region = this.regionLookupFn(regionName);
			region.setDefaultEl(el as HTMLElement);
			return;
		} else if (elName === this.componentPrefix) {
			const componentName: string = el.getAttribute("name");
			const moduleName: string = el.getAttribute("module");
			const moduleToUse: Module = moduleName ? Modules.getModule(moduleName) : this.moduleInstance;
			const component: Component = (moduleToUse || this.moduleInstance).get(componentName);
			el.parentElement.replaceChild(component.getEl(), el);

			for (let i = el.attributes.length - 1; i >= 0; i--) {
				const attributeName: string = el.attributes[i].name.toLowerCase();
				const attributeValue: string = el.attributes[i].value;

				if (attributeName.indexOf(this.externalAttributePrefix) === 0) {
					const propertyName: string = attributeName.substr(this.externalAttributePrefix.length);
					const detail: ExternalAttributeDetail = {
						attributeName: propertyName,
						expression: attributeValue
					};

					component.message(INTERNAL_DIRECT_CHANNEL_NAME, "addExternalAttribute", detail);
				}
			}

			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParentScope", this.scope);
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
			this.components.push(component);
			return;
		}

		// tslint:disable-next-line
		for (let i = 0; i < el.children.length; i++) {
			queue.push(el.children[i] as HTMLElement);
		}

		this.processTextChildren(el.childNodes);

		const attributes: NamedNodeMap = el.attributes;
		const length: number = attributes.length;
		const names: string[] = [];

		for (let i = 0; i < length; i++) {
			names.push(attributes[i].name);
		}

		for (const name of names) {
			const expression: string = el.getAttribute(name);
			if (name.indexOf(this.eventElementMediatorPrefix) === 0) {
				const eventName: string = name.substr(this.eventElementMediatorPrefix.length);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(EVT_NAME_ERR, { "%eventName%": eventName });
				}

				this.addEventElementMediator(eventName.toLowerCase(), expression, el as HTMLElement);
				el.removeAttribute(name);
			} else if (name.indexOf(this.elementMediatorPrefix) === 0) {
				const elementMediatorType: string = name.substr(this.elementMediatorPrefix.length);
				this.addElementMediator(el.tagName.toLowerCase(), elementMediatorType, expression, el as HTMLElement);
				el.removeAttribute(name);
			} else if (expression.length > 4 && expression.indexOf("{{") === 0 && expression.indexOf("}}", expression.length - 2) !== -1) {
				const trimmedExpression: string = expression.substring(2, expression.length - 2);
				this.addAttributeElementMediator(name, trimmedExpression, el as HTMLElement);
			}
		}
	}

	private processTextChildren(children: NodeListOf<ChildNode>): void {
		const discoveredNodes: ChildNode[] = [];

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if (TEXT_NODE_TYPE === child.nodeType) {
				discoveredNodes.push(child);
			}
		}

		for (const node of discoveredNodes) {
			const result: Node[] = this.splitChild(node);

			if (result.length > 1) {
				for (const newNode of result) {
					node.parentNode.insertBefore(newNode, node);
				}

				node.remove();
			}
		}
	}

	private splitChild(node: Node): Node[] {
		const source: string = node.textContent || "";
		const sections: string[] = source.split(/(\{\{|\}\})/);

		if (sections.length < 2) {
			return [node];
		}

		let inside: boolean = false;

		const collected: Node[] = [];

		for (const section of sections) {
			switch (section) {
				case "{{":
					inside = true;
					break;

				case "}}":
					inside = false;
					break;

				default:
					if (inside) {
						const beginComment: Comment = Properties.getWindow().document.createComment("#");
						collected.push(beginComment);
						const textNode: Text = Properties.getWindow().document.createTextNode(section);
						textNode.textContent = "";
						this.addTextElementMediator(section, textNode);
						collected.push(textNode);
						const endComment: Comment = Properties.getWindow().document.createComment("#");
						collected.push(endComment);
					} else {
						const textNode: Text = Properties.getWindow().document.createTextNode(section);
						collected.push(textNode);
					}
					break;
			}
		}

		return collected;
	}

	private addTextElementMediator(expression: string, el: Text): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Text" };
		const elementMediator: TextElementMediator = new TextElementMediator(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

	private addEventElementMediator(eventName: string, expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Event" };
		const elementMediator: EventElementMediator = new EventElementMediator(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.setEventKey(eventName);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

	private addAttributeElementMediator(attributeName: string, expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Event" };
		const elementMediator: AttributeElementMediator = new AttributeElementMediator(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.setAttributeName(attributeName);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

	private addElementMediator(tag: string, elementMediatorType: string, attributeValue: string, el: HTMLElement): void {
		const tags: { [tag: string]: new () => ElementMediator<any, HTMLElement, any>; } = MvvmImpl.factories[elementMediatorType];
		const prefix: string = this.elementMediatorPrefix + elementMediatorType;

		let elementMediator: ElementMediator<any, HTMLElement, any> = null;

		if (!tags) {
			return;
		}

		let elementMediatorClass: any = tags[tag];

		if (!elementMediatorClass) {
			elementMediatorClass = tags["*"];
		}

		if (!elementMediatorClass) {
			this.logger.error("Unsupported tag: " + tag + " for elementMediator " + elementMediatorType + ".");
			return;
		}

		const deps = { mvvm: this, parent: this.parent, el: el, expression: attributeValue, model: this.model, prefix: prefix };
		elementMediator = new elementMediatorClass(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.init();

		this.elementMediators.push(elementMediator);

		if (elementMediator.hasPropagation()) {
			this.propagatedElementMediators.push(elementMediator);
		}
	}

}

export default MvvmImpl;
