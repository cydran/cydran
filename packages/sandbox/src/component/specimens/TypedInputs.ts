import { Component } from "@cydran/cydran";
import TEMPLATE from "./TypedInputs.html";

class TypedInputs extends Component {

	private value: string;

	private dateValue: Date;

	private numberValue: number;

	constructor() {
		super(TEMPLATE);
		this.value = "";
		this.dateValue = new Date();
		this.numberValue = 0;
	}

	public logValues(): void {
		this.$c().getLogger().info("String Value:", this.value);
		this.$c().getLogger().info("String Type:", Object.prototype.toString.call(this.value));
		this.$c().getLogger().info("Date Value:", this.dateValue);
		this.$c().getLogger().info("Date Type:", Object.prototype.toString.call(this.dateValue));
		this.$c().getLogger().info("Number Value:", this.numberValue);
		this.$c().getLogger().info("Number Type:", Object.prototype.toString.call(this.numberValue));
		console.log(this);
	}

	public changeValues(): void {
		this.value = "Changed String Value";
		this.dateValue = new Date("2023-01-01");
		this.numberValue = 42;
	}

}

export default TypedInputs;
