import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Nestable from "@/component/Nestable";
import ComponentInternals from "@/component/ComponentInternals";
import ObjectUtils from "@/util/ObjectUtils";

const isDefined = ObjectUtils.isDefined;

class Region {

	private logger: Logger;

	private defaultEl: HTMLElement;

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	constructor(name: string, parent: ComponentInternals) {
		this.logger = LoggerFactory.getLogger("Region " + this.name + " for " + parent.getId());
		this.defaultEl = null;
		this.component = null;
		this.parent = parent;
		this.name = name;
	}

	public setDefaultEl(defaultEl: HTMLElement): void {
		this.defaultEl = defaultEl;
	}

	public setComponent(component: Nestable): void {
		if (this.component === component) {
			this.logger.trace("Component unchanged, so not setting.");
			return;
		}

		this.logger.ifTrace(() => "Setting component " + component.getId());

		if (isDefined(component) && !isDefined(this.component)) {
			this.component = component;
			const newComponentEl: HTMLElement = component.getEl();
			const parentElement: HTMLElement = this.defaultEl.parentElement;
			parentElement.replaceChild(newComponentEl, this.defaultEl);
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		} else if (!isDefined(component) && isDefined(this.component)) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			const oldComponentEl: HTMLElement = this.component.getEl();
			this.component = null;
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(this.defaultEl, oldComponentEl);
		} else if (isDefined(component) && isDefined(this.component)) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			const newComponentEl: HTMLElement = component.getEl();
			const oldComponentEl: HTMLElement = this.component.getEl();
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(newComponentEl, oldComponentEl);
			this.component = component;
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
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

	public dispose() {
		if (isDefined(this.component)) {
			this.component.dispose();
		}

		this.setComponent(null);
	}

}

export default Region;
