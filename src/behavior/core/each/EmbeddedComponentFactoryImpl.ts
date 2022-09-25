import ComponentFactory from "component/ComponentFactory";
import { Nestable } from "interface/ComponentInterfaces";
import Context from "context/Context";
import { isDefined } from "util/Utils";

class EmbeddedComponentFactoryImpl implements ComponentFactory {

	private context: Context;

	private componentId: string;

	private contextId: string;

	private parent: Nestable;

	constructor(context: Context, componentId: string, contextId: string, parent: Nestable) {
		this.context = context;
		this.componentId = componentId;
		this.contextId = contextId;
		this.parent = parent;
	}

	public create(item: any): Nestable {
		const context: Context = isDefined(this.contextId) && this.contextId.trim().length > 0 ? this.context.getChild(this.contextId) : this.context;

		const component: Nestable = context.get(this.componentId);
		component.$c().tell("setItemFn", () => item);
		component.$c().tell("setParent", this.parent);

		return component;
	}
}

export default EmbeddedComponentFactoryImpl;
