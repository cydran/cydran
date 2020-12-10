import Region from "component/Region";
import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import { isDefined } from "util/Utils";
import ElementReference from "component/ElementReference";
import ComponentInternals from "component/ComponentInternals";
import { EMPTY_OBJECT_FN } from "const/Functions";
import { LockedRegionError, UnknownComponentError } from "error/Errors";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asIdentity, asBoolean } from 'util/AsFunctions';
import RegionAttributes from "behavior/core/region/RegionAttributes";
import { validateDefined, validateValidId, validateValidKey } from "validator/Validations";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Module from "module/Module";

const DEFAULT_ATTRIBUTES: RegionAttributes = {
	lock: false,
	component: null,
	name: null,
	value: null,
	module: null
};

class RegionBehavior extends AbstractBehavior<any, HTMLElement, RegionAttributes> implements Region, Tellable {

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	private itemFn: () => any;

	private expression: string;

	private element: ElementReference<HTMLElement>;

	private locked: boolean;

	constructor(parent: ComponentInternals, element: HTMLElement) {
		super();
		this.itemFn = EMPTY_OBJECT_FN;
		this.component = null;
		this.parent = parent;
		this.expression = null;
		this.element = new ElementReferenceImpl<HTMLElement>(element, "Empty");
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
	}

	public onInit(context: BehaviorDependencies): void {
		const nameFromAttribute: string = this.getParams().name;
		this.name = isDefined(nameFromAttribute) ? nameFromAttribute : context.parent.createRegionName();
		this.setLoggerName(`Region ${this.name} for ${context.parent.getId()}`);
		context.parent.addRegion(this.name, this);

		const componentName: string = this.getParams().component;
		const moduleName: string = this.getParams().module;
		const valueExpression: string = this.getParams().value;

		this.itemFn = isDefined(valueExpression) ? () => this.parent.evaluate(valueExpression) : EMPTY_OBJECT_FN;
		this.expression = valueExpression;
		this.syncComponentMode();

		if (isDefined(componentName) && componentName !== "") {
			const moduleToUse: Module = isDefined(moduleName) ? context.parent.getModule().getModule(moduleName) : context.parent.getModule();
			const component: Nestable = isDefined(moduleToUse) ? moduleToUse.get(componentName) : context.parent.getModule().get(componentName);

			if (!isDefined(component)) {
				const componentClassName: string = context.parent.getComponent().constructor.name;
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

	public setComponent(component: Nestable): void {
		if (isDefined(this.component) && this.locked) {
			throw new LockedRegionError(`Region ${this.name} is locked and can not be updated`);
		}

		if (this.component === component) {
			this.getLogger().trace("Component unchanged, so not setting.");
			return;
		}

		if (isDefined(component)) {
			this.getLogger().ifTrace(() => `Setting component ${component.getId()}`);
		}

		if (isDefined(this.component)) {
			this.component.tell("setItemFn", EMPTY_OBJECT_FN);
			this.component.tell("setMode", "");
		}

		if (isDefined(component)) {
			component.tell("setItemFn", this.itemFn);
		}

		if (isDefined(component) && !isDefined(this.component)) {
			// Component being set, no existing component
			this.component = component;
			this.component.tell("setParent", this.parent.getComponent());
		} else if (!isDefined(component) && isDefined(this.component)) {
			// Component being nulled, existing component present
			this.component.tell("setParent", null);
			this.component = null;
		} else if (isDefined(component) && isDefined(this.component)) {
			// Component being set, existing component present
			this.component.tell("setParent", null);
			this.component = component;
			this.component.tell("setParent", this.parent.getComponent());
		}

		const replacementElement: HTMLElement = isDefined(this.component) ? this.component.getEl() : null;
		this.element.set(replacementElement);
		this.syncComponentMode();
	}

	public tellComponent(name: string, payload: any): void {
		if (isDefined(this.component)) {
			this.component.tell(name, payload);
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (isDefined(this.component)) {
			this.component.message(channelName, messageName, payload);
		}
	}

	public hasComponent(): boolean {
		return isDefined(this.component);
	}

	public $dispose() {
		if (isDefined(this.component)) {
			this.component.$dispose();
		}

		this.setComponent(null);
	}

	private syncComponentMode(): void {
		if (isDefined(this.component)) {
			const mode = isDefined(this.expression) ? "repeatable" : "";
			this.component.tell("setMode", mode);
		}
	}

}

export default RegionBehavior;
