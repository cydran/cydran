import ComponentFactory from "component/ComponentFactory";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import Nestable from "interface/ables/Nestable";
import Module from "module/Module";

class UtilityComponentFactoryImpl implements ComponentFactory {
	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	private module: Module;

	private valueFn: () => any;

	constructor(module: Module, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any, valueFn: () => any) {
		this.module = module;
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
		this.valueFn = valueFn;
	}

	public create(): Nestable {
		return new Component(this.template, {
			prefix: this.prefix,
			parentModelFn: this.parentModelFn,
			module: this.module,
			repeatable: true,
			itemFn: this.valueFn,
			parent: this.parent,
			skipId: this.parentId
		} as ComponentOptions);
	}
}

export default UtilityComponentFactoryImpl;
