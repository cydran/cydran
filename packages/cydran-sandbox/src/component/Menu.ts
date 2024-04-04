import { Component } from "cydran";
import TEMPLATE from "./Menu.html";

class Menu extends Component {

	private expanded: boolean;

	constructor() {
		super(TEMPLATE);
		this.expanded = false;
	}

	public handleClick(name: string): void {
		this.$c().send('navigate', name).onChannel('navigation').toContext();
	}

	public handleMenuToggle(): void {
		this.expanded = !this.expanded;
	}

	public sendUpdate(): void {
		this.$c().send("updateName", "Bob").onChannel("helloWorldChannel").globally();
	}

}

export default Menu;
