import ComponentFactory from "@/element/repeat/ComponentFactory";
import Nestable from "@/component/Nestable";
import UtilityComponent from "@/element/repeat/UtilityComponent";

class UtilityComponentFactoryImpl implements ComponentFactory {

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

	public create(): Nestable {
		return new UtilityComponent(this.template, this.prefix, this.parent, this.parentId, this.parentModelFn);
	}

}

export default UtilityComponentFactoryImpl;
