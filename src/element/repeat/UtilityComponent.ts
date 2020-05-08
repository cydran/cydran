import Component from "@/component/Component";
import Nestable from "@/component/Nestable";
import { ComponentConfigImpl } from "@/component/ComponentConfig";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Module from "@/module/Module";

class UtilityComponent extends Component {

	constructor(module: Module, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.withPrefix(prefix);
		config.setParentModelFn(parentModelFn);
		config.setModule(module);
		super(template, config);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "skipId", parentId);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
	}

}

export default UtilityComponent;
