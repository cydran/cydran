import ComponentFactory from "component/ComponentFactory";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import { Nestable } from "interface/ComponentInterfaces";
import { Context } from "context/Context";
import ComponentTransitions from "component/ComponentTransitions";

class ItemComponentFactoryImpl implements ComponentFactory {
	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	private context: Context;

	constructor(context: Context, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any, valueFn: () => any) {
		this.context = context;
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
			context: this.context,
			repeatable: true
		} as ComponentOptions);

		component.$c().tell("setItemFn", () => item);
		component.$c().tell("setParentContext", this.context);
		component.$c().tell(ComponentTransitions.INIT);
		component.$c().tell("setParent", this.parent);

		return component;
	}
}

export default ItemComponentFactoryImpl;
