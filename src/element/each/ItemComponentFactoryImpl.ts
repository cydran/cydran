import ComponentFactory from "@/element/each/ComponentFactory";
import Nestable from "@/component/Nestable";
import ItemComponent from "@/element/each/ItemComponent";
import Module from "@/module/Module";

class ItemComponentFactoryImpl implements ComponentFactory {

	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	private module: Module;

	constructor(module: Module, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any) {
		this.module = module;
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
	}

	public create(item?: any): Nestable {
		return new ItemComponent(this.module, this.template, this.prefix, this.parent, this.parentId, this.parentModelFn, () => item);
	}

}

export default ItemComponentFactoryImpl;

