import { Component } from "@cydran/cydran";
import TEMPLATE from "./CheckboxState.html";

class CheckboxState extends Component {

	private checked: boolean;

	constructor() {
		super(TEMPLATE);
		this.checked = true;
	}

}

export default CheckboxState;
