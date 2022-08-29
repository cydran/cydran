import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import Renderer from "component/Renderer";
import Context from "context/Context";

class StageComponent extends Component {

	constructor(renderer: Renderer, context: Context) {
		super(renderer, {
			name: `StageComponent`,
			context: context,
			alwaysConnected: true
		} as ComponentOptions);
	}

}

export default StageComponent;
