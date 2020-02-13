import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Component from "@/component/Component";
import ComponentInternals from "@/component/ComponentInternals";

class Region {

	private logger: Logger;

	private defaultEl: HTMLElement;

	private component: Component;

	private parent: ComponentInternals;

	private name: string;

	constructor(name: string, parent: ComponentInternals) {
		this.defaultEl = null;
		this.component = null;
		this.parent = parent;
		this.name = name;
		this.logger = LoggerFactory.getLogger("Region " + this.name + " for " + parent.getId());
	}

	public setDefaultEl(defaultEl: HTMLElement): void {
		this.defaultEl = defaultEl;
	}

	public setComponent(component: Component): void {
		this.logger.trace("Setting component");

		if (this.component === component) {
			return;
		}

		if (component !== null && this.component === null) {
			this.component = component;
			const newComponentEl: HTMLElement = component.getEl();
			const parentElement: HTMLElement = this.defaultEl.parentElement;
			parentElement.replaceChild(newComponentEl, this.defaultEl);
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		} else if (component === null && this.component !== null) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			const oldComponentEl: HTMLElement = this.component.getEl();
			this.component = null;
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(this.defaultEl, oldComponentEl);
		} else if (component !== null && this.component !== null) {
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
		if (this.component !== null && this.component !== undefined) {
			this.component.message(channelName, messageName, payload);
		}
	}

	public hasComponent(): boolean {
		return !!this.component;
	}

	public dispose() {
		if (this.component) {
			this.component.dispose();
		}

		this.setComponent(null);
	}

}

export default Region;
