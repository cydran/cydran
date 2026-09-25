import { Component } from "@cydran/cydran";
import TEMPLATE from "./ReadOnly.html";

interface Address {

	firstName: string;

	lastName: string;

	line1: string;

	line2: string;

	city: string;

	state: string;

	postalCode: string;

}

class ReadOnly extends Component {

	private address: Address;

	private lineEditable: boolean;

	private firstNameMaxLength: number;

	constructor() {
		super(TEMPLATE);
		this.address = {
			firstName: "John",
			lastName: "Doe",
			line1: "123 Anystreet",
			line2: "Suite 100",
			city: "Los Angeles",
			state: "CA",
			postalCode: "90601"
		};
		this.lineEditable = true;
		this.firstNameMaxLength = 5;
	}

	public toggleLineEditable(): void {
		this.lineEditable = !this.lineEditable;
	}

	public focusLastName(): void {
		this.$c().forElement("lastName").focus();
	}

}

export default ReadOnly;
