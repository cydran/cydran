import { Component } from "@cydran/cydran";
import TEMPLATE from "./SpecimensHome.html";

interface Group {

	id: string;

	title: string;

	items: Item[];

}

interface Item {

	id: string;

	title: string;

}

class SpecimensHome extends Component {

	private activeItem: string;

	private groups: Group[];

	constructor() {
		super(TEMPLATE);
		this.groups = [
			{
				id: "intro",
				title: "",
				items: [
					{
						id: "intro",
						title: "Introduction"
					}
				]
			},
			{
				id: "behaviors",
				title: "Behaviors",
				items: [
					{
						id: "notyetimplemented",
						title: "Input Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Each Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Hidden Behavior"
					},
					{
						id: "notyetimplemented",
						title: "MultiSelect Value Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Required Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Validated Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Attribute Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Enabled Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Id Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Radio Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Series Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Valued Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "CSS Class Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Focus Behavior"
					},
					{
						id: "notyetimplemented",
						title: "If Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Read Only Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Style Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Checked Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Form Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Inert Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Region Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Text Behavior"
					}
				]
			},
			{
				id: "legacy",
				title: "Legacy",
				items: [
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
					},
					{
						id: "typedInputs",
						title: "Typed Inputs"
					}
				]
			}
		];
		this.activeItem = "intro";
	}

	public onMount(): void {
		this.$c().regions().setByObjectId("body", "/specimens/intro");		
	}

	public show(name: string): void {
		this.activeItem = name;
		this.$c().regions().setByObjectId("body", "/specimens/../specimens/" + name);
	}

}

export default SpecimensHome;
