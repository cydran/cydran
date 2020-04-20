import ComponentFactory from "@/element/repeat/ComponentFactory";
import Nestable from "@/component/Nestable";
import ItemComponent from "@/element/repeat/ItemComponent";

class ItemComponentFactoryImpl implements ComponentFactory {

	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	constructor(template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any) {
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
	}

	public create(item?: any): Nestable {
		return new ItemComponent(this.template, this.prefix, this.parent, this.parentId, this.parentModelFn, () => item);
	}

}

export default ItemComponentFactoryImpl;

