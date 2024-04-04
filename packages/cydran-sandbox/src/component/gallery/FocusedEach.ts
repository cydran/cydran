import { Component } from "cydran";
import TEMPLATE from "./FocusedEach.html";

interface Item {

	id: string;

	value: string;

}

class FocusedEach extends Component {

	private items: Item[];

	private rotationItems: Item[];

	private counter: number;

	constructor() {
		super(TEMPLATE);
		this.counter = 0;
		this.items = [];
		this.rotationItems = [
			{
				id: "1",
				value: "Alpha"
			},
			{
				id: "2",
				value: "Beta"
			},
			{
				id: "3",
				value: "Gamma"
			},
			{
				id: "4",
				value: "Delta"
			},
			{
				id: "5",
				value: "Epsilon"
			},
			{
				id: "6",
				value: "Zeta"
			},
			{
				id: "7",
				value: "Eta"
			}
		];
		this.$c().onInterval(1000).invoke(() => {
			this.add();
			this.rotate();
			this.$c().sync();
		});
	}

	public add(): void {
		this.items.push({
			id: this.counter + "",
			value: "Item " + this.counter
		});

		this.counter++;
	}

	public clear(): void {
		this.items = [];
		this.counter = 0;
	}

	public rotate(): void {
		const item: Item = this.rotationItems.shift();
		this.rotationItems.push(item);
	}

}

export default FocusedEach;
