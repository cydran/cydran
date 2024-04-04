import { Component } from "@cydran/cydran";
import TEMPLATE from "./WatchedField.html";

class WatchedField extends Component {

	private myField: string;

	private regex: RegExp = new RegExp("[^a-zA-Z0-9\ ]+");

	constructor() {
		super(TEMPLATE);
		this.myField = "Kilroy was here";
		this.$c().onExpressionValueChange("m().myField", (previous: any, current: any) => {
			this.myField = current.replace(this.regex, '');
		});
	}

}

export default WatchedField;
