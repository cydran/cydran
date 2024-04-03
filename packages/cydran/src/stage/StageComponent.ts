import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import Renderer from "component/Renderer";

class StageComponent extends Component {

	constructor(renderer: Renderer) {
		super(renderer, {
			name: `StageComponent`,
			alwaysConnected: true
		} as ComponentOptions);
	}

}

export default StageComponent;
