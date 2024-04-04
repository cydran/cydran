import { Component } from "@cydran/cydran";
import TEMPLATE from "./HelloWorld.html";

class HelloWorld extends Component {

	private name: string;

	constructor() {
		super(TEMPLATE);
		this.$c().onMessage("updateName").forChannel("helloWorldChannel").invoke(this.setName);
		this.name = "Anonymous";
	}

	public setName(name: string): void {
		this.name = name;
	}

}

export default HelloWorld;
