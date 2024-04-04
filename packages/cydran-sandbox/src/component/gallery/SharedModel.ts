import { Component } from "cydran";
import TEMPLATE from "./SharedModel.html";

class SharedModel extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "";
	}

}

export default SharedModel;
