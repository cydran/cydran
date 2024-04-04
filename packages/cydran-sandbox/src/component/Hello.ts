import { Component } from "cydran";
import TEMPLATE from "./Hello.html";

interface Item {

	id?: string;

	name: string;

}

class Hello extends Component {

	private name: string;

	private items: Item[];

	private active: boolean;

	constructor() {
		super(TEMPLATE);
		this.items = [];
		this.name = "";
		this.active = false;
	}

	public add(): void {
		this.items.push({
			name: this.name
		});

		this.name = "";
	}

	public resetForm(): void {
		this.$c().forForms().reset();
	}

}

export default Hello;
