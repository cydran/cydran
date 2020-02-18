import Mvvm from "@/mvvm/Mvvm";
import Logger from "@/logger/Logger";
import Region from "@/component/Region";
import LoggerFactory from "@/logger/LoggerFactory";
import GuardGenerator from "@/pattern/GuardGenerator";
import ScopeImpl from "@/model/ScopeImpl";
import { INTERNAL_DIRECT_CHANNEL_NAME, TEXT_NODE_TYPE } from "@/constant/Constants";
import ModelMediatorImpl from "@/model/ModelMediatorImpl";
import ModelMediator from "@/model/ModelMediator";
import DigestionContextImpl from "@/mvvm/DigestionContextImpl";
import DigestionContext from "@/mvvm/DigestionContext";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import Module from "@/module/Module";
import ElementMediator from "@/element/ElementMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Nestable from "@/component/Nestable";
import TemplateError from "@/error/TemplateError";
import { Modules } from "@/module/Modules";
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

	private componentPrefix: string;

	private components: Nestable[];

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
		this.propagatingElementMediators = [];
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
		const start: number = Date.now();
		const context: DigestionContext = new DigestionContextImpl();
		const seen: SimpleMap<boolean> = {};
		const sources: MediatorSource[] = [];
		sources.push(this);

		for (const component of this.components) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		while (sources.length > 0) {
			const source: MediatorSource = sources.pop();
			const guard: string = source.getGuard();

			if (guard !== null && seen[guard]) {
				continue;
			}

			seen[guard] = true;
			source.requestMediatorSources(sources);
			source.requestMediators(context);
		}

		context.digest();
		this.logger.ifTrace(() => this.getGuard() + " - Elapsed millis " + (Date.now() - start));
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		if (this.parent.hasExternalMediators()) {
			const mediators: DigestionCandidate[] = [];

			mediators.push({
				evaluate: () => {
					this.parent.importExternals();

					return false;
				},
				execute: () => {
					// Intentionally do nothing
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
				execute: () => {
					// Intentionally do nothing
				},
				notify: () => {
					// Intentionally do nothing
				}
			});

			consumer.add(this.getGuard(), mediators);
		} else {
			consumer.add(this.getGuard(), this.mediators);
		}
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		if (this.parent.hasExternalMediators() || this.parent.getFlags().repeatable) {
			this.parent.getParent().message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		for (const source of this.propagatingElementMediators) {
			sources.push(source);
		}
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
			const component: Nestable = (moduleToUse || this.moduleInstance).get(componentName);
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
		const tags: { [tag: string]: new () => ElementMediator<any, HTMLElement, any>; } = Factories.get(elementMediatorType);
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
			this.propagatingElementMediators.push(elementMediator);
		}
	}

}

export default MvvmImpl;
