import Component from "@/component/Component";
import Nestable from "@/component/Nestable";
import { ComponentConfigImpl } from "@/component/ComponentConfig";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";

class UtilityComponent extends Component {

	constructor(template: string, prefix: string, parent: Nestable, parentModelFn: () => any) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.withPrefix(prefix);
		config.setParentModelFn(parentModelFn);
		super(template, config);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", parent);
		this.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
	}

}

export default UtilityComponent;
