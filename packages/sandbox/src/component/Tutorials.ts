import { Component, PagedFilter, To } from "@cydran/cydran";
import TEMPLATE from "./Tutorials.html";

class Tutorials extends Component {

	private mdContent: string;

	private counter: number;

	private whichOne: string = "";

	private selectedDropdownOption: string;

	private escapedString: string;

	private items: {
		id?: number | string,
		title: string;
	}[];

	private filtered: PagedFilter;

	constructor() {
		super(TEMPLATE);

		this.items = [];

		this.filtered = this.$c().createFilter("m().items").paged();
		this.filtered.setPageSize(3);

		this.counter = 0;
		this.selectedDropdownOption = "";

		this.escapedString = "first & second > < >";
	}

	public handleMyClick(): void {
		this.counter++;

		this.items.push({
			title: "Item #" + this.counter,
		});
	}

	public logItems(): void {
		this.$c().getLogger().info("", this.items);
	}

	public removeItem(id: number): void {
		this.items = this.items.filter((item) => item.id !== id);
	}

	public handleChange(): void {
		window.alert("Changed");
	}

	public sendUpdate(): void {
		this.$c().send("updateName", "Bob").onChannel("helloWorldChannel").withPropagation(To.GLOBALLY);
	}

}

export default Tutorials;
