import Region from "element/Region";
import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import { isDefined, requireNotNull } from "util/Utils";
import ElementReference from "element/ElementReference";
import { ComponentInternals } from "internals/Shuttle";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import { EMPTY_OBJECT_FN } from "const/Functions";
import { LockedRegionError } from "error/Errors";
import ElementReferenceImpl from "element/ElementReferenceImpl";


class RegionImpl implements Region, Tellable {

	private logger: Logger;

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	private itemFn: () => any;

	private expression: string;

	private initialComponentFn: () => Nestable;

	private locked: boolean;

	private element: ElementReference<HTMLElement>;

	constructor(name: string, parent: ComponentInternals, element: HTMLElement, locked: boolean) {
		this.logger = LoggerFactory.getLogger(`Region ${this.name} for ${parent.getId()}`);
		this.locked = requireNotNull(locked, "locked");
		this.itemFn = EMPTY_OBJECT_FN;
		this.component = null;
		this.parent = parent;
		this.name = name;
		this.expression = null;
		this.element = new ElementReferenceImpl<HTMLElement>(element, "Empty");
	}

	public populate(): void {
		if (isDefined(this.initialComponentFn)) {
			this.setComponent(this.initialComponentFn());
			this.initialComponentFn = null;
		}
	}

	public hasExpression(): boolean {
		return isDefined(this.expression);
	}

	public setExpression(expression: string): void {
		this.itemFn = isDefined(expression) ? () => this.parent.evaluate(expression) : EMPTY_OBJECT_FN;
		this.expression = expression;
		this.syncComponentMode();
	}

	public getComponent<N extends Nestable>(): N {
		return this.component as N;
	}

	public setComponent(component: Nestable): void {
		if (isDefined(this.component) && this.locked) {
			throw new LockedRegionError(`Region ${this.name} is locked and can not be updated`);
		}

		if (this.component === component) {
			this.logger.trace("Component unchanged, so not setting.");
			return;
		}

		if (isDefined(component)) {
			this.logger.ifTrace(() => `Setting component ${component.getId()}`);
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

	public tell(name: string, payload: any): void {
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

	public setInitialComponentFn(initialComponentFn: () => Nestable): void {
		this.initialComponentFn = initialComponentFn;
	}

	private syncComponentMode(): void {
		if (isDefined(this.component)) {
			const mode = isDefined(this.expression) ? "repeatable" : "";
			this.component.tell("setMode", mode);
		}
	}
}

export default RegionImpl;
