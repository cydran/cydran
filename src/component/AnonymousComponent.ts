import Component from "@/component/Component";
import { ComponentConfigImpl, ComponentConfig } from "@/component/ComponentConfig";
import Module from "@/module/Module";
import { isDefined } from "@/util/ObjectUtils";

class AnonymousComponent extends Component {

	constructor(module: Module, template: string, config?: ComponentConfig) {
		const configInstance: ComponentConfigImpl = isDefined(config) ? config as ComponentConfigImpl : new ComponentConfigImpl();
		configInstance.setModule(module);
		super(template, configInstance);
	}

}

export default AnonymousComponent;
