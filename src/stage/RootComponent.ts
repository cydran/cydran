import Component from "@/component/Component";
import Renderer from "@/component/Renderer";
import Module from "@/module/Module";
import { ComponentConfigImpl } from "@/component/ComponentConfig";

class RootComponent extends Component {

	constructor(module: Module, renderer: Renderer) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.setModule(module);
		super(renderer, config);
	}

	public isConnected(): boolean {
		return true;
	}

}

export default RootComponent;