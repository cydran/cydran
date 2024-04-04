import { Component } from "cydran";
import TEMPLATE from "./MultiSelects.html";

interface Item {

	name: string;

	value: number;

}

class MultiSelects extends Component {

	private myValues: string[];

	private insideList: Item[];

	constructor() {
		super(TEMPLATE);
		this.myValues = ["2", "4"];
		this.insideList = [
			{ name: 'Name 1', value: 1 },
			{ name: 'Name 2', value: 2 },
			{ name: 'Name 3', value: 3 },
			{ name: 'Name 4', value: 4 },
			{ name: 'Name 5', value: 5 }
		];
	}

}

export default MultiSelects;
