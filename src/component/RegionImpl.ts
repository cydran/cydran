import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import { INTERNAL_DIRECT_CHANNEL_NAME, EMPTY_OBJECT_FN } from "@/constant/Constants";
import Nestable from "@/component/Nestable";
import ComponentInternals from "@/component/ComponentInternals";
import { isDefined } from "@/util/ObjectUtils";
import Region from "@/component/Region";
import ElementReference from "@/element/ElementReference";
import ElementReferenceImpl from "@/element/ElementReferenceImpl";

class RegionImpl implements Region {

	private logger: Logger;

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	private itemFn: () => any;

	private expression: string;

	private initialComponentFn: () => Nestable;

	private element: ElementReference<HTMLElement>;

	constructor(name: string, parent: ComponentInternals, element: HTMLElement) {
		this.logger = LoggerFactory.getLogger("Region " + this.name + " for " + parent.getId());
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
		this.itemFn = isDefined(expression)
			? () => this.parent.evaluate(expression)
			: EMPTY_OBJECT_FN;

		this.expression = expression;

		this.syncComponentMode();
	}

	public getComponent<N extends Nestable>(): N {
		return this.component as N;
	}

	public setComponent(component: Nestable): void {
		if (this.component === component) {
			this.logger.trace("Component unchanged, so not setting.");
			return;
		}

		if (isDefined(component)) {
			this.logger.ifTrace(() => "Setting component " + component.getId());
		}

		if (isDefined(this.component)) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", EMPTY_OBJECT_FN);
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "");
		}

		if (isDefined(component)) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", this.itemFn);
		}

		if (isDefined(component) && !isDefined(this.component)) {
			// Component being set, no existing component
			this.component = component;
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		} else if (!isDefined(component) && isDefined(this.component)) {
			// Component being nulled, existing component present
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			this.component = null;
		} else if (isDefined(component) && isDefined(this.component)) {
			// Component being set, existing component present
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			this.component = component;
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		}

		const replacementElement: HTMLElement = isDefined(this.component) ? this.component.getEl() : null;
		this.element.set(replacementElement);

		this.syncComponentMode();
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (isDefined(this.component)) {
			this.component.message(channelName, messageName, payload);
		}
	}

	public hasComponent(): boolean {
		return isDefined(this.component);
	}

	public dispose() {
		if (isDefined(this.component)) {
			this.component.dispose();
		}

		this.setComponent(null);
	}

	public setInitialComponentFn(initialComponentFn: () => Nestable): void {
		this.initialComponentFn = initialComponentFn;
	}

	private syncComponentMode(): void {
		if (isDefined(this.component)) {
			if (isDefined(this.expression)) {
				this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
			} else {
				this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "");
			}
		}
	}

}

export default RegionImpl;
