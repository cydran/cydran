import { Component } from "cydran";
import TEMPLATE from "./RepeatItem.html";

class RepeatItem extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public handleClick(): void {
		this.$c().getLogger().info(this.$c().getValue());
	}

}

export default RepeatItem;
