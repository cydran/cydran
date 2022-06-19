import ComponentFactory from "component/ComponentFactory";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import Module from "module/Module";
import { Nestable } from "interface/ComponentInterfaces";

class ItemComponentFactoryImpl implements ComponentFactory {
	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	private module: Module;

	constructor(module: Module, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any, valueFn: () => any) {
		this.module = module;
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
	}

	public create(item?: any): Nestable {
		const component: Component = new Component(this.template, {
			prefix: this.prefix,
			parentModelFn: this.parentModelFn,
			module: this.module,
			repeatable: true
		} as ComponentOptions);

		component.$c().tell("setItemFn", () => item);
		component.$c().tell("setParent", this.parent);

		return component;
	}
}

export default ItemComponentFactoryImpl;
