import { Component } from "cydran";
import TEMPLATE from "./TutorialChild.html";

class TutorialChild extends Component {

	private localValue: string;

	constructor() {
		super(TEMPLATE);
		this.$c().onMessage("testMessage").forChannel("testGlobal").invoke(this.reset);
		this.reset();
	}

	public reset(): void {
		this.localValue = "initialized";
	}

	public handleClick(): void {
		console.log(this.$c().getValue());
		this.$c().getValue()["color"] = "#ff0000";
		console.log(this.$c().getValue());
	}

}

export default TutorialChild;
