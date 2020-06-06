import Mvvm from "@/mvvm/Mvvm";
import Logger from "@/logger/Logger";
import Region from "@/component/Region";
import LoggerFactory from "@/logger/LoggerFactory";
import ScopeImpl from "@/model/ScopeImpl";
import { INTERNAL_DIRECT_CHANNEL_NAME, TEXT_NODE_TYPE } from "@/constant/Constants";
import ModelMediatorImpl from "@/model/ModelMediatorImpl";
import ModelMediator from "@/model/ModelMediator";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import Module from "@/module/Module";
import ElementMediator from "@/element/ElementMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Nestable from "@/component/Nestable";
import TemplateError from "@/error/TemplateError";
import ExternalAttributeDetail from "@/model/ExternalAttributeDetail";
import Properties from "@/config/Properties";
import TextElementMediator from "@/element/TextElementMediator";
import EventElementMediator from "@/element/EventElementMediator";
import AttributeElementMediator from "@/element/AttributeElementMediator";
import Factories from "@/mvvm/Factories";
import MediatorSource from "@/mvvm/MediatorSource";
import SimpleMap from "@/pattern/SimpleMap";
import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";
import DigestionCandidate from "@/mvvm/DigestionCandidate";
import DirectEvents from "@/constant/DirectEvents";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import Type from "@/type/Type";
import { isDefined, requireNotNull } from "@/util/ObjectUtils";
import UnknownComponentError from "@/error/UnknownComponentError";
import Digester from "@/mvvm/Digester";
import DigesterImpl from "@/mvvm/DigesterImpl";
import Messagable from "@/message/Messagable";
import { createCommentOffDom, createTextNodeOffDom } from "@/util/DomUtils";

class MvvmImpl implements Mvvm {

	private logger: Logger;

	private el: HTMLElement;

	private elementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private mediators: ModelMediatorImpl<any>[];

	private propagatingElementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private model: any;

	private parent: ComponentInternals;

	private moduleInstance: Module;

	private elementMediatorPrefix: string;

	private eventElementMediatorPrefix: string;

	private externalAttributePrefix: string;

	private regionPrefix: string;

	private namePrefix: string;

	private componentPrefix: string;

	private components: Nestable[];

	private scope: ScopeImpl;

	private id: string;

	private namedElements: SimpleMap<HTMLElement>;

	private regionLookupFn: (name: string) => Region;

	private modelFn: () => any;

	private itemFn: () => any;

	private externalFn: () => any;

	private digester: Digester;

	constructor(id: string, model: any, moduleInstance: Module, prefix: string, scope: ScopeImpl, parentModelFn: () => any) {
		this.id = requireNotNull(id, "id");
		this.elementMediatorPrefix = prefix + ":";
		this.eventElementMediatorPrefix = prefix + ":on";
		this.externalAttributePrefix = prefix + ":property-";
		this.regionPrefix = prefix + ":region";
		this.namePrefix = prefix + ":name";
		this.componentPrefix = prefix + ":component";
		this.logger = LoggerFactory.getLogger("Mvvm " + this.id);
		this.propagatingElementMediators = [];
		this.scope = new ScopeImpl(false);
		this.scope.setParent(scope);
		this.elementMediators = [];
		this.namedElements = {};
		this.mediators = [];
		this.model = model;
		this.moduleInstance = moduleInstance;
		this.components = [];
		this.digester = new DigesterImpl(this, this.id, () => this.parent.getComponent().constructor.name, () => this.components);

		const localModelFn: () => any = () => this.model;
		this.modelFn = parentModelFn ? parentModelFn : localModelFn;
		this.itemFn = () => this.parent.getData();
		this.externalFn = () => this.parent.getExternalCache();

		this.scope.add("m", this.modelFn);
		this.scope.add("model", this.modelFn);
		this.scope.add("i", this.itemFn);
		this.scope.add("item", this.itemFn);
		this.scope.add("v", this.itemFn);
		this.scope.add("value", this.itemFn);
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

	public nestingChanged(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.message(INTERNAL_DIRECT_CHANNEL_NAME, DirectEvents.NESTING_CHANGED);
		}

		for (const component of this.components) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, DirectEvents.NESTING_CHANGED);
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
		this.namedElements = null;
	}

	public getId(): string {
		return this.id;
	}

	public getNamedElement<E extends HTMLElement>(name: string): E {
		const element: E = this.namedElements[name] as E;
		return (element === undefined) ? null : element;
	}

	public mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T> {
		const mediator: ModelMediator<T> = new ModelMediatorImpl<T>(this.model, expression, this.scope, this, reducerFn);
		this.mediators.push(mediator as ModelMediatorImpl<any>);

		return mediator;
	}

	public getScope(): ScopeImpl {
		return this.scope;
	}

	public digest(): void {
		if (this.parent.getFlags().repeatable) {
			this.parent.getParent().message(INTERNAL_DIRECT_CHANNEL_NAME, "digest");
		} else {
			this.digester.digest();
		}
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		if (this.parent.hasExternalMediators()) {
			const mediators: DigestionCandidate[] = [];

			mediators.push({
				evaluate: () => {
					this.parent.importExternals();

					return false;
				},
				notify: () => {
					// Intentionally do nothing
				}
			});

			for (const mediator of this.mediators) {
				mediators.push(mediator);
			}

			mediators.push({
				evaluate: () => {
					this.parent.exportExternals();

					return false;
				},
				notify: () => {
					// Intentionally do nothing
				}
			});

			consumer.add(this.getId(), mediators);
		} else {
			consumer.add(this.getId(), this.mediators);
		}
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		if (this.parent.hasExternalMediators() || this.parent.getFlags().repeatable) {
			if (isDefined(this.parent.getParent())) {
				this.parent.getParent().message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
			}
		}

		this.parent.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeRegionDigestionCandidates", sources);

		for (const source of this.propagatingElementMediators) {
			sources.push(source);
		}
	}

	public getParent(): ComponentInternals {
		return this.parent;
	}

	public $apply(fn: Function, args: any[]): any {
		let result: any = null;

		try {
			this.parent.importExternals();
		} catch (e) {
			this.logger.error("Error importing externals");
		}

		result = fn.apply(this.model, args);

		try {
			this.parent.exportExternals();
		} catch (e) {
			this.logger.error("Error exporting externals");
		}

		this.digest();

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

	public skipId(id: string): void {
		this.digester.skipId(id);
	}

	public getMessagables(): Messagable[] {
		return this.components;
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
			const valueExpression: string = el.getAttribute("value") || null;
			const region: Region = this.regionLookupFn(regionName);
			region.setDefaultEl(el as HTMLElement);
			region.setExpression(valueExpression);
			return;
		} else if (elName === this.componentPrefix) {
			const componentName: string = el.getAttribute("name");
			const moduleName: string = el.getAttribute("module");
			const moduleToUse: Module = moduleName ? this.moduleInstance.getModule(moduleName) : this.moduleInstance;
			const component: Nestable = (moduleToUse || this.moduleInstance).get(componentName);

			if (!isDefined(component)) {
				throw new UnknownComponentError("Unknown component " + componentName + " referenced in component " + this.parent.getComponent().constructor.name);
			}

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

				this.addEventElementMediator(eventName.toLowerCase(), this.trimExpression(expression), el as HTMLElement);
				el.removeAttribute(name);
			} else if (name.indexOf(this.namePrefix) === 0) {
				const namedElementName: string = el.getAttribute(name);
				this.namedElements[namedElementName] = el;
				el.removeAttribute(name);
			} else if (name.indexOf(this.elementMediatorPrefix) === 0) {
				const elementMediatorType: string = name.substr(this.elementMediatorPrefix.length);
				this.addElementMediator(el.tagName.toLowerCase(), elementMediatorType, this.trimExpression(expression), el as HTMLElement);
				el.removeAttribute(name);
			} else if (expression.length > 4 && expression.indexOf("{{") === 0 && expression.indexOf("}}", expression.length - 2) !== -1) {
				this.addAttributeElementMediator(name, this.trimExpression(expression), el as HTMLElement);
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

	private trimExpression(input: string): string {
		const result: string = (input.length > 4 && input.indexOf("{{") === 0 && input.indexOf("}}", input.length - 2) !== -1)
			? input.substring(2, input.length - 2)
			: input;

		return result;
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
						const beginComment: Comment = createCommentOffDom("#");
						collected.push(beginComment);
						const textNode: Text = createTextNodeOffDom(section);
						textNode.textContent = "";
						this.addTextElementMediator(section, textNode);
						collected.push(textNode);
						const endComment: Comment = createCommentOffDom("#");
						collected.push(endComment);
					} else {
						const textNode: Text = createTextNodeOffDom(section);
						collected.push(textNode);
					}
					break;
			}
		}

		return collected;
	}

	private addTextElementMediator(expression: string, el: Text): void {
		const deps: ElementMediatorDependencies = {
			mvvm: this,
			parent: this.parent,
			el: el,
			expression: expression,
			model: this.model,
			prefix: "Text",
			module: this.moduleInstance
		};

		const elementMediator: TextElementMediator = new TextElementMediator(deps);
		elementMediator.init();
		this.elementMediators.push(elementMediator);
	}

	private addEventElementMediator(eventName: string, expression: string, el: HTMLElement): void {
		const deps: ElementMediatorDependencies = {
			mvvm: this,
			parent: this.parent,
			el: el,
			expression: expression,
			model: this.model,
			prefix: "Event",
			module: this.moduleInstance
		};

		const elementMediator: EventElementMediator = new EventElementMediator(deps);
		elementMediator.setEventKey(eventName);
		elementMediator.init();
		this.elementMediators.push(elementMediator);
	}

	private addAttributeElementMediator(attributeName: string, expression: string, el: HTMLElement): void {
		const deps: ElementMediatorDependencies = {
			mvvm: this,
			parent: this.parent,
			el: el,
			expression: expression,
			model: this.model,
			prefix: "Event",
			module: this.moduleInstance
		};

		const elementMediator: AttributeElementMediator = new AttributeElementMediator(deps);
		elementMediator.setAttributeName(attributeName);
		elementMediator.init();
		this.elementMediators.push(elementMediator);
	}

	private addElementMediator(tag: string, elementMediatorType: string, attributeValue: string, el: HTMLElement): void {
		const tags: SimpleMap<Type<ElementMediator<any, HTMLElement, any>>> = Factories.get(elementMediatorType);
		const prefix: string = this.elementMediatorPrefix + elementMediatorType;

		let elementMediator: ElementMediator<any, HTMLElement, any> = null;

		if (!tags) {
			return;
		}

		let elementMediatorClass: Type<ElementMediator<any, HTMLElement, any>> = tags[tag];

		if (!elementMediatorClass) {
			elementMediatorClass = tags["*"];
		}

		if (!elementMediatorClass) {
			this.logger.error("Unsupported tag: " + tag + " for elementMediator " + elementMediatorType + ".");
			return;
		}

		const deps: ElementMediatorDependencies = {
			mvvm: this,
			parent: this.parent,
			el: el,
			expression: attributeValue,
			model: this.model,
			prefix: prefix,
			module: this.moduleInstance
		};

		elementMediator = new elementMediatorClass(deps);
		elementMediator.init();

		this.elementMediators.push(elementMediator);

		if (elementMediator.hasPropagation()) {
			this.propagatingElementMediators.push(elementMediator);
		}
	}

}

export default MvvmImpl;
