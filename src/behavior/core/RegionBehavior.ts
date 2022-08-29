import Region from "component/Region";
import Tellable from "interface/ables/Tellable";
import { extractClassName, isDefined } from "util/Utils";
import ElementReference from "component/ElementReference";
import ComponentInternals from "component/ComponentInternals";
import { LockedRegionError, UnknownComponentError } from "error/Errors";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import { asBoolean } from 'util/AsFunctions';
import RegionAttributes from "behavior/core/region/RegionAttributes";
import { validateDefined, validateValidId, validateValidKey } from "validator/Validations";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Context from "context/Context";
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";
import DigestableSource from "behavior/DigestableSource";
import { Nestable } from "interface/ComponentInterfaces";

const DEFAULT_ATTRIBUTES: RegionAttributes = {
	lock: false,
	component: null,
	name: null,
	value: null,
	context: null
};

class RegionBehavior extends AbstractContainerBehavior<any, HTMLElement, RegionAttributes> implements Region, Tellable {

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	private itemFn: () => any;

	private expression: string;

	private element: ElementReference<HTMLElement>;

	private locked: boolean;

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
			name: [validateValidKey],
			component: [validateValidId],
			context: [validateValidId]
		});
		this.setConverters({
			lock: asBoolean
		});
		this.setDefaultExpression("");
	}

	public onInit(dependencies: BehaviorDependencies): void {
		this.element = new ElementReferenceImpl<HTMLElement>(dependencies.services.getDom(), dependencies.el as HTMLElement, "Empty");
		const nameFromAttribute: string = this.getParams().name;
		this.name = isDefined(nameFromAttribute) ? nameFromAttribute : dependencies.parent.createRegionName();
		this.setLoggerName(`Region ${this.name} for ${dependencies.parent.getId()}`);
		dependencies.parent.addRegion(this.name, this);

		const componentName: string = this.getParams().component;
		const contextName: string = this.getParams().context;
		const valueExpression: string = this.getParams().value;

		this.itemFn = isDefined(valueExpression) ? () => this.parent.evaluate(valueExpression) : null;
		this.expression = valueExpression;

		if (isDefined(componentName) && componentName !== "") {
			const contextToUse: Context = isDefined(contextName) ? dependencies.parent.getContext().getContext(contextName) : dependencies.parent.getContext();
			const component: Nestable = isDefined(contextToUse) ? contextToUse.get(componentName) : dependencies.parent.getContext().get(componentName);

			if (!isDefined(component)) {
				const componentClassName: string = extractClassName(dependencies.parent.getComponent());
				throw new UnknownComponentError(`Unknown component ${ componentName } referenced in component ${ componentClassName }`);
			}

			this.setComponent(component);
		}

		const explicitlyLocked: boolean = this.getParams().lock;
		const implicitlyLocked: boolean = isDefined(componentName) && componentName !== "" && !isDefined(nameFromAttribute);
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

	public tellComponent(name: string, payload: any): void {
		if (isDefined(this.component)) {
			this.component.$c().tell(name, payload);
		}
	}

	public messageComponent(channelName: string, messageName: string, payload: any): void {
		if (isDefined(this.component)) {
			this.component.$c().send(messageName, payload).onChannel(channelName).toSelf();
		}
	}

	public hasComponent(): boolean {
		return isDefined(this.component);
	}

	public $dispose() {
		this.setComponent(null);
	}

}

export default RegionBehavior;
