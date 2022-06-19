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
import Module from "module/Module";
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";
import DigestableSource from "behavior/DigestableSource";
import { Nestable } from "interface/ComponentInterfaces";

const DEFAULT_ATTRIBUTES: RegionAttributes = {
	lock: false,
	component: null,
	name: null,
	value: null,
	module: null
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
			module: [validateValidId]
		});
		this.setConverters({
			lock: asBoolean
		});
		this.setDefaultExpression("");
	}

	public onInit(context: BehaviorDependencies): void {
		this.element = new ElementReferenceImpl<HTMLElement>(context.cydranContext.getDom(), context.el as HTMLElement, "Empty");
		const nameFromAttribute: string = this.getParams().name;
		this.name = isDefined(nameFromAttribute) ? nameFromAttribute : context.parent.createRegionName();
		this.setLoggerName(`Region ${this.name} for ${context.parent.getId()}`);
		context.parent.addRegion(this.name, this);

		const componentName: string = this.getParams().component;
		const moduleName: string = this.getParams().module;
		const valueExpression: string = this.getParams().value;

		this.itemFn = isDefined(valueExpression) ? () => this.parent.evaluate(valueExpression) : null;
		this.expression = valueExpression;

		if (isDefined(componentName) && componentName !== "") {
			const moduleToUse: Module = isDefined(moduleName) ? context.parent.getModule().getModule(moduleName) : context.parent.getModule();
			const component: Nestable = isDefined(moduleToUse) ? moduleToUse.get(componentName) : context.parent.getModule().get(componentName);

			if (!isDefined(component)) {
				const componentClassName: string = extractClassName(context.parent.getComponent());
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
			this.component.$c().message(channelName, messageName).self(payload);
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
