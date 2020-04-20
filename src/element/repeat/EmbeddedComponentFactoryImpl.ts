import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import ComponentFactory from "@/element/repeat/ComponentFactory";
import Nestable from "@/component/Nestable";
import Module from "@/module/Module";
import { Modules } from "@/module/Modules";
import ObjectUtils from "@/util/ObjectUtils";

class EmbeddedComponentFactoryImpl implements ComponentFactory {

	private componentId: string;

	private moduleId: string;

	private parent: Nestable;

	private parentId: string;

	constructor(componentId: string, moduleId, parent: Nestable, parentId: string) {
		this.componentId = componentId;
		this.moduleId = moduleId;
		this.parent = parent;
		this.parentId = parentId;
	}

	public create(item: any): Nestable {
		const module: Module = ObjectUtils.isDefined(this.moduleId) && this.moduleId.trim().length > 0
			? Modules.getModule(this.moduleId)
			: Modules.getDefaultModule();

		const component: Nestable = module.get(this.componentId);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", () => item);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "skipId", this.parentId);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent);

		return component;
	}

}

export default EmbeddedComponentFactoryImpl;
