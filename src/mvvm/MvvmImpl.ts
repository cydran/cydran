import Mvvm from "@/mvvm/Mvvm";
import ScopeImpl from "@/model/ScopeImpl";
import { INTERNAL_DIRECT_CHANNEL_NAME, TEXT_NODE_TYPE, ANONYMOUS_REGION_PREFIX } from "@/constant/Constants";
import ModelMediatorImpl from "@/model/ModelMediatorImpl";
import ModelMediator from "@/model/ModelMediator";
import Module from "@/module/Module";
import ElementMediator from "@/element/ElementMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Nestable from "@/component/Nestable";
import TemplateError from "@/error/TemplateError";
import MediatorSource from "@/mvvm/MediatorSource";
import SimpleMap from "@/pattern/SimpleMap";
import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";
import DirectEvents from "@/constant/DirectEvents";
import { isDefined, requireNotNull, requireValid } from "@/util/ObjectUtils";
import Digester from "@/mvvm/Digester";
import DigesterImpl from "@/mvvm/DigesterImpl";
import Messagable from "@/message/Messagable";
import RegionImpl from "@/component/RegionImpl";
import MvvmDomWalkerImpl from "@/mvvm/MvvmDomWalkerImpl";
import DomWalker from "@/dom/DomWalker";
import Region from "@/component/Region";

const WALKER: DomWalker<Mvvm> = new MvvmDomWalkerImpl();

class MvvmImpl implements Mvvm {

	private el: HTMLElement;

	private elementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private mediators: ModelMediatorImpl<any>[];

	private propagatingElementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private model: any;

	private parent: ComponentInternals;

	private moduleInstance: Module;

	private elementMediatorPrefix: string;

	private eventElementMediatorPrefix: string;

	private namePrefix: string;

	private components: Nestable[];

	private scope: ScopeImpl;

	private id: string;

	private namedElements: SimpleMap<HTMLElement>;

	private regionAddFn: (name: string, element: HTMLElement, locked: boolean) => RegionImpl;

	private modelFn: () => any;

	private itemFn: () => any;

	private digester: Digester;

	private anonymousRegionNameIndex: number;

	constructor(id: string, model: any, moduleInstance: Module, prefix: string, scope: ScopeImpl, parentModelFn: () => any) {
		this.id = requireNotNull(id, "id");
		this.anonymousRegionNameIndex = 0;
		this.elementMediatorPrefix = prefix + ":";
		this.eventElementMediatorPrefix = prefix + ":on";
		this.namePrefix = prefix + ":name";
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

		this.scope.add("m", this.modelFn);
		this.scope.add("v", this.itemFn);
	}

	public init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => RegionImpl): void {
		this.el = el;
		this.parent = parent;
		this.regionAddFn = regionAddFn;
		this.validateEl();
		WALKER.walk(this.el, this);
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
		const mediator: ModelMediator<T> = new ModelMediatorImpl<T>(this.model, expression, this.scope, reducerFn);
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
		consumer.add(this.getId(), this.mediators);
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		if (this.parent.getFlags().repeatable) {
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
		const result: any = fn.apply(this.model, args);
		this.digest();

		return result;
	}

	public getModelFn(): () => any {
		return this.modelFn;
	}

	public getModule(): Module {
		return this.moduleInstance;
	}

	public getItemFn(): () => any {
		return this.itemFn;
	}

	public skipId(id: string): void {
		this.digester.skipId(id);
	}

	public getMessagables(): Messagable[] {
		return this.components;
	}

	public getModel(): any {
		return this.model;
	}

	private validateEl(): void {
		if (this.el.tagName.toLowerCase() === "script") {
			throw new TemplateError("Templates must not have a script tag as the top level tag.");
		}
	}

	public addRegion(name: string, element: HTMLElement, locked: boolean): Region {
		return this.regionAddFn(name, element, locked);
	}

	public createRegionName(): string {
		const name: string = ANONYMOUS_REGION_PREFIX + this.anonymousRegionNameIndex;
		++this.anonymousRegionNameIndex;

		return name;
	}

	public addMediator(mediator: any): void {
		this.elementMediators.push(mediator as ElementMediator<any, HTMLElement | Text, any>);
	}

	public addPropagatingElementMediator(mediator: any): void {
		this.propagatingElementMediators.push(mediator as ElementMediator<any, HTMLElement | Text, any>);
	}

	public getEventElementMediatorPrefix(): string {
		return this.eventElementMediatorPrefix;
	}

	public getNamePrefix(): string {
		return this.namePrefix;
	}

	public getElementMediatorPrefix(): string {
		return this.elementMediatorPrefix;
	}

	public addNamedElement(name: string, element: HTMLElement): void {
		this.namedElements[name] = element;
	}

}

export default MvvmImpl;
