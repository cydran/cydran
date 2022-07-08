import ComponentFactory from "component/ComponentFactory";
import { Nestable } from "interface/ComponentInterfaces";
import Module from "module/Module";
import { isDefined } from "util/Utils";

class EmbeddedComponentFactoryImpl implements ComponentFactory {

	private module: Module;

	private componentId: string;

	private moduleId: string;

	private parent: Nestable;

	constructor(module: Module, componentId: string, moduleId: string, parent: Nestable) {
		this.module = module;
		this.componentId = componentId;
		this.moduleId = moduleId;
		this.parent = parent;
	}

	public create(item: any): Nestable {
		const module: Module =
			isDefined(this.moduleId) && this.moduleId.trim().length > 0 ? this.module.getModule(this.moduleId) : this.module.getDefaultModule();

		const component: Nestable = module.get(this.componentId);
		component.$c().tell("setItemFn", () => item);
		component.$c().tell("setParent", this.parent);

		return component;
	}
}

export default EmbeddedComponentFactoryImpl;
