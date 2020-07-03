import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import ComponentFactory from "@/element/each/ComponentFactory";
import Nestable from "@/component/Nestable";
import Module from "@/module/Module";
import { isDefined } from "@/util/ObjectUtils";

class EmbeddedComponentFactoryImpl implements ComponentFactory {

	private module: Module;

	private componentId: string;

	private moduleId: string;

	private parent: Nestable;

	private parentId: string;

	constructor(module: Module, componentId: string, moduleId, parent: Nestable, parentId: string) {
		this.module = module;
		this.componentId = componentId;
		this.moduleId = moduleId;
		this.parent = parent;
		this.parentId = parentId;
	}

	public create(item: any): Nestable {
		const module: Module = isDefined(this.moduleId) && this.moduleId.trim().length > 0
			? this.module.getModule(this.moduleId)
			: this.module.getDefaultModule();

		const component: Nestable = module.get(this.componentId);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", () => item);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "skipId", this.parentId);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent);

		return component;
	}

}

export default EmbeddedComponentFactoryImpl;
