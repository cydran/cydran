import EachAttributes from "behavior/core/each/EachAttributes";
import Nestable from "interface/ables/Nestable";
import ScopeImpl from "scope/ScopeImpl";
import ComponentFactory from "component/ComponentFactory";
import IdStrategy from "behavior/core/each/IdStrategy";
import DEFAULT_ID_KEY from "const/DefaultIdKey";
import GeneratedIdStrategyImpl from "behavior/core/each/GeneratedIdStrategyImpl";
import ExpressionIdStrategyImpl from "behavior/core/each/ExpressionIdStrategyImpl";
import NoneIdStrategyImpl from "behavior/core/each/NoneIdStrategyImpl";
import InvalidIdStrategyImpl from "behavior/core/each/InvalidIdStrategyImpl";
import DigestableSource from "behavior/DigestableSource";
import { isDefined, removeChildElements } from "util/Utils";
import { TemplateError } from "error/Errors";
import BehaviorFlags from "behavior/BehaviorFlags";
import EachIdStrategies from "behavior/core/each/EachIdStrategies";
import { validateDefined, validateNotEmptyString, validateNotNullIfFieldEquals, validateOneOf } from 'validator/Validations';
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";
import RefreshStrategy from "behavior/core/each/RefreshStrategy";
import UnfocusedRefreshStrategy from "behavior/core/each/UnfocusedRefreshStrategy";
import Populater from "behavior/core/each/Populater";
import ElementPopulater from "behavior/core/each/ElementPopulater";
import FragmentPopulater from "behavior/core/each/FragmentPopulater";
import EachStateImpl from "behavior/core/each/EachStateImpl";
import EachChildParser from 'behavior/core/each/EachChildParser';
import EachConfig from "behavior/core/each/EachConfig";
import EachConfigImpl from 'behavior/core/each/EachConfigImpl';
import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import EachTemplateAttributes from "behavior/core/each/EachTemplateAttributes";
import EmptyRefreshStrategy from "behavior/core/each/EmptyRefreshStrategy";
import FocusedRefreshStrategy from "behavior/core/each/FocusedRefreshStrategy";

const DEFAULT_ATTRIBUTES: EachAttributes = {
	mode: "generated",
	idkey: DEFAULT_ID_KEY,
	expression: null
};

type CreateFactoryFn = (template: HTMLTemplateElement, params: EachTemplateAttributes, factory: any) => ComponentFactory;

class EachBehavior extends AbstractContainerBehavior<any[], HTMLElement, EachAttributes> {

	private state: EachStateImpl;

	private config: EachConfig;

	private scopeItem: any;

	private idStrategy: IdStrategy;

	private populater: Populater;

	private emptyRefreshStrategy: RefreshStrategy;

	private unfocusedRefreshStrategy: RefreshStrategy;

	private focusedRefreshStrategy: RefreshStrategy;

	constructor() {
		super();
		this.setFlag(BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED);
		this.setDefaults(DEFAULT_ATTRIBUTES);
		this.setValidations({
			idkey: [validateDefined, validateNotEmptyString],
			expression: [validateNotEmptyString, validateNotNullIfFieldEquals("mode", "expression")],
			mode: [validateDefined, validateOneOf('none', 'generated', 'expression')]
		});
		this.state = new EachStateImpl();
	}

	public onInit(): void {
		this.populater = this.getEl().tagName.toLowerCase() === "select" ? new ElementPopulater(this.getEl()) : new FragmentPopulater(this.getEl(), this.getDom());
		this.config = new EachConfigImpl(this.getExpression(), this.getPrefix(), this.getBehaviorPrefix());
	}

	public onMount(): void {
		this.initScope();
		this.initIdStrategy();
		this.initStrategies();
		this.parseChildElements();
		this.initChildElements(this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onChange);
		}

		this.state.mount();
	}

	public onUnmount(): void {
		this.state.unmount();
	}

	public onRemount(): void {
		this.state.mount();
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		this.state.requestDigestionSources(sources);
	}

	protected onChange(previous: any[], current: any[]): void {
		const items: any[] = current || [];

		if (items.length === 0) {
			this.emptyRefreshStrategy.refresh(items);
		} else if (this.getDom().elementIsFocused(this.getEl())) {
			this.focusedRefreshStrategy.refresh(items);
		} else {
			this.unfocusedRefreshStrategy.refresh(items);
		}
	}

	protected initChildElements(items: any[] = []): void {
		if (items.length === 0) {
			this.emptyRefreshStrategy.refresh(items);
		} else {
			this.unfocusedRefreshStrategy.refresh(items);
		}
	}

	private initScope(): void {
		const localScope = new ScopeImpl();
		const modelFn: () => any = () => this.getModelFn();
		const itemFn: () => any = () => this.scopeItem;
		localScope.setParent(this.getParent().scope() as ScopeImpl);
		localScope.setMFn(modelFn);
		localScope.setVFn(itemFn);
		this.state.setLocalScope(localScope);
	}

	private initIdStrategy(): void {
		switch (this.getParams().mode) {
			case EachIdStrategies.GENERATED:
				this.idStrategy = new GeneratedIdStrategyImpl(this.getParams().idkey);
				break;

			case EachIdStrategies.NONE:
				this.idStrategy = new NoneIdStrategyImpl(this.getParams().idkey);
				break;

			case EachIdStrategies.EXPRESSION:
				this.idStrategy = new ExpressionIdStrategyImpl(this.getParams().expression, this.getLogger());
				break;

			default:
				this.idStrategy = new InvalidIdStrategyImpl();
		}

		this.idStrategy.init();
	}

	private initStrategies(): void {
		this.emptyRefreshStrategy = new EmptyRefreshStrategy(this.getEl(), this.state);
		this.unfocusedRefreshStrategy = new UnfocusedRefreshStrategy(this.getEl(), this.populater, this.idStrategy, this.state, (item: any) => this.create(item));
		this.focusedRefreshStrategy = new FocusedRefreshStrategy(this.getEl(), this.populater, this.idStrategy, this.state, (item: any) => this.create(item),
			this.getDom());
	}

	private parseChildElements(): void {
		const element: HTMLElement = this.getEl();
		const createFactoryFn: CreateFactoryFn = (template, params, factory) => this.createFactory(template, params, factory);
		const parser: EachChildParser = new EachChildParser(this.state, this.config, createFactoryFn);

		parser.parse(element, this.isValidated());

		removeChildElements(element);

		if (this.state.getEmpty()) {
			element.appendChild(this.state.getEmpty().getEl());
		}
	}

	private create(item: any): Nestable {
		this.scopeItem = item;
		let factory: ComponentFactory = null;

		try {
			factory = this.state.findFactory();
		} finally {
			this.scopeItem = null;
		}

		if (!isDefined(factory)) {
			throw new TemplateError(`template structure for an ${ EachBehavior.name } structure is incorrect or incomplete`);
		}

		return factory.create(item);
	}

	private createFactory(template: HTMLTemplateElement, params: EachTemplateAttributes, factory: any): ComponentFactory {
		const valueFn: () => any = isDefined(params.value) ? () => this.mediate(params.value).get() : this.getValueFn();

		return isDefined(params.component)
			? new EmbeddedComponentFactoryImpl(this.getModule(), params.component, params.module, this.getParent())
			: new factory(this.getModule(), template.innerHTML.trim(), this.getParent().getPrefix(), this.getParent(), this.getParentId(), this.getModelFn(), valueFn);
	}

}

export default EachBehavior;
