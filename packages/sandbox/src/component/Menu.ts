import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./Menu.html";

class Menu extends Component {

	private expanded: boolean;

	private label: string;

	constructor() {
		super(TEMPLATE);
		this.expanded = false;
		this.label = "Cydran"
	}

	public handleClick(name: string): void {
		this.$c().send('navigate', name).onChannel('navigation').withPropagation(To.CONTEXT);
	}

	public handleMenuToggle(): void {
		this.expanded = !this.expanded;
	}

	public sendUpdate(): void {
		this.$c().send("updateName", "Bob").onChannel("helloWorldChannel").withPropagation(To.GLOBALLY);
	}

	public getLabel(): string {
		return this.label;
	}

}

export default Menu;
