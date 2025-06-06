import { Component } from "@cydran/cydran";
import TEMPLATE from "./Gallery.html";

interface Item {

	id: string;

	title: string;

}

class Gallery extends Component {

	private activeItem: string;

	private items: Item[];

	constructor() {
		super(TEMPLATE);
		this.items = [
			{
				id: "intro",
				title: "Introduction"
			},
			{
				id: "logging",
				title: "Logging"
			},
			{
				id: "regions",
				title: "Regions"
			},
			{
				id: "validation",
				title: "Validation"
			},
			{
				id: "radioButtons",
				title: "Radio Buttons"
			},
			{
				id: "multiSelects",
				title: "Multi-Selects"
			},
			{
				id: "sharedModel",
				title: "Shared Model"
			},
			{
				id: "readOnly",
				title: "Read Only"
			},
			{
				id: "svg",
				title: "SVG"
			},
			{
				id: "checkboxState",
				title: "Checkbox State"
			},
			{
				id: "modals",
				title: "Modals"
			},
			{
				id: "watchedField",
				title: "Watched Field"
			},
			{
				id: "focusedEach",
				title: "Focused Each"
			},
			{
				id: "clock",
				title: "Clock"
			},
			{
				id: "webComponentExample",
				title: "Web Component"
			},
			{
				id: "formElements",
				title: "Form Elements"
			}
		];
		this.activeItem = "intro";
	}

	public onMount(): void {
		this.$c().regions().setByObjectId("body", "/gallery/intro");		
	}

	public show(name: string): void {
		this.activeItem = name;
		this.$c().regions().setByObjectId("body", "/gallery/../gallery/" + name);
	}

}

export default Gallery;
