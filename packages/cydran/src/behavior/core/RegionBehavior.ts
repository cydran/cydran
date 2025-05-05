import Region from "component/Region";
import Tellable from "interface/ables/Tellable";
import { extractClassName, isDefined } from "util/Utils";
import ElementReference from "component/ElementReference";
import ComponentInternals from "component/ComponentInternals";
import { LockedRegionError, UnknownComponentError } from "error/Errors";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import { asBoolean } from 'util/AsFunctions';
import RegionAttributes from "behavior/core/region/RegionAttributes";
import { validateDefined, validateRequestableObjectPath, validateValidRegionName } from "validator/Validations";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";
import DigestableSource from "behavior/DigestableSource";
import { Context, Nestable } from "context/Context";
import ComponentTransitions from 'component/ComponentTransitions';

const DEFAULT_ATTRIBUTES: RegionAttributes = {
	lock: false,
	path: null,
	name: null,
	value: null
};

class RegionBehavior extends AbstractContainerBehavior<unknown, HTMLElement, RegionAttributes> implements Region, Tellable {

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	private itemFn: () => unknown;

	private expression: string;

	private element: ElementReference<HTMLElement>;

	private locked: boolean;

	public dependencies: BehaviorDependencies;

	constructor(parent: ComponentInternals) {
		super();
		this.itemFn = null;
		this.component = null;
		this.parent = parent;
		this.expression = null;
		this.locked = false;
		this.setDefaults(DEFAULT_ATTRIBUTES);
		this.setValidations({
			lock: [validateDefined],
			name: [validateValidRegionName],
			path: [validateRequestableObjectPath]
		});
		this.setConverters({
			lock: asBoolean
		});
		this.setDefaultExpression("");
		this.setPrefixed(false);
	}

	public onInit(dependencies: BehaviorDependencies): void {
		this.element = new ElementReferenceImpl<HTMLElement>(dependencies.el as HTMLElement, "Empty");
		const nameFromAttribute: string = this.getParams().name;
		this.name = isDefined(nameFromAttribute) ? nameFromAttribute : dependencies.parent.createRegionName();
		this.setLoggerName(`Region ${this.name} for ${dependencies.parent.getId()}`);
		dependencies.parent.addRegion(this.name, this);
		this.dependencies = dependencies;
	}

	public onMount(): void {
		const path: string = this.getParams().path;
		const valueExpression: string = this.getParams().value;

		this.itemFn = isDefined(valueExpression) ? () => this.parent.evaluate(valueExpression) : null;
		this.expression = valueExpression;

		if (isDefined(path) && path !== "") {
			const contextToUse: Context = this.dependencies.parent.getContext();
			const component: Nestable = contextToUse.getObject(path);

			if (!isDefined(component)) {
				const componentClassName: string = extractClassName(this.dependencies.parent.getComponent());
				throw new UnknownComponentError(`Unknown component ${ path } referenced in component ${ componentClassName }`);
			}

			this.setComponent(component);
		}

		const explicitlyLocked: boolean = this.getParams().lock;
		const implicitlyLocked: boolean = isDefined(path) && path !== "" && !isDefined(this.getParams().name);
		this.locked = explicitlyLocked || implicitlyLocked;
	}

	public hasExpression(): boolean {
		return isDefined(this.expression);
	}

	public getComponent<N extends Nestable>(): N {
		return this.component as N;
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		if (this.hasExpression() && isDefined(this.component)) {
			sources.push(this.component.$c());
		}
	}

	public setComponent(component: Nestable): void {
		if (isDefined(this.component) && this.locked) {
			throw new LockedRegionError(`Region ${this.name} is locked and can not be updated`);
		}

		if (this.component === component) {
			this.getLogger().trace("Component unchanged, so not setting.");
			return;
		}

		if (isDefined(component)) {
			this.getLogger().ifTrace(() => `Setting component ${component.$c().getId()}`);
			component.$c().tell("setParentContext", this.getContext());
			component.$c().tell(ComponentTransitions.INIT, null);
		}

		if (isDefined(this.component)) {
			this.component.$c().tell("setItemFn", null);
		}

		if (isDefined(component)) {
			component.$c().tell("setItemFn", this.itemFn);
		}

		if (isDefined(component) && !isDefined(this.component)) {
			// Component being set, no existing component
			this.component = component;
			this.element.set(this.component.$c().getEl());
			this.component.$c().tell("setParent", this.parent.getComponent());
		} else if (!isDefined(component) && isDefined(this.component)) {
			// Component being nulled, existing component present
			this.component.$c().tell("setParent", null);
			this.component = null;
			this.element.set(null);
		} else if (isDefined(component) && isDefined(this.component)) {
			// Component being set, existing component present
			this.component.$c().tell("setParent", null);
			this.component = component;
			this.element.set(this.component.$c().getEl());
			this.component.$c().tell("setParent", this.parent.getComponent());
		}
	}

	public tellComponent(name: string, payload: unknown): void {
		if (isDefined(this.component)) {
			this.component.$c().tell(name, payload);
		}
	}

	public messageComponent(channelName: string, messageName: string, payload: unknown): void {
		if (isDefined(this.component)) {
			this.component.$c().send(messageName, payload).onChannel(channelName).toSelf();
		}
	}

	public hasComponent(): boolean {
		return isDefined(this.component);
	}

	public $release() {
		this.setComponent(null);
	}

}

export default RegionBehavior;
