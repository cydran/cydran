import Component from "@/component/Component";
import Nestable from "@/component/Nestable";
import { ComponentConfigImpl, ComponentConfig } from "@/component/ComponentConfig";
import { INTERNAL_DIRECT_CHANNEL_NAME, COMPONENT_INTERNALS_FIELD_NAME } from "@/constant/Constants";
import ComponentInternalsImpl from "@/component/ComponentInternalsImpl";

class ItemComponent extends Component {

	constructor(template: string, prefix: string, parent: Nestable, parentGuard: string, parentModelFn: () => any, data: any) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.withPrefix(prefix);
		config.setParentModelFn(parentModelFn);
		super(template, config);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setData", data);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "skipGuard", parentGuard);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this[COMPONENT_INTERNALS_FIELD_NAME] = new ComponentInternalsImpl(this, template, config);
		this[COMPONENT_INTERNALS_FIELD_NAME]["init"]();
	}

}

export default ItemComponent;
