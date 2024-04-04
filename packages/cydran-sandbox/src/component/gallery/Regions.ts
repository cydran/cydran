import { Component } from "cydran";
import TEMPLATE from "./Regions.html";
import UlComponent from "./regions/UlComponent";
import InlineComponent from "./regions/InlineComponent";
import Item from "./regions/Item";

class Regions extends Component {

	private items: Item[];

	private index: number;

	constructor() {
		super(TEMPLATE);
		this.items = [
			{
				firstName: "James",
				lastName: "Kirk"
			},
			{
				firstName: "Montgomery",
				lastName: "Scott"
			},
			{
				firstName: "Leonard",
				lastName: "McCoy"
			}
		];

		this.index = 0;
		this.useUlComponent();
	}

	public useItem(index: number): void {
		this.index = index;
	}

	public useUlComponent(): void {
		this.$c().regions().set("item", new UlComponent());
	}

	public useInlineComponent(): void {
		this.$c().regions().set("item", new InlineComponent());
	}

}

export default Regions;
