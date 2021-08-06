import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import Renderer from "component/Renderer";
import Module from "module/Module";

class StageComponent extends Component {

	constructor(renderer: Renderer, module: Module) {
		super(renderer, {
			module: module,
			alwaysConnected: true
		} as ComponentOptions);
	}

}

export default StageComponent;
