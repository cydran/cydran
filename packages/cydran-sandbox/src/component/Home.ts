import { Component } from "cydran";
import TEMPLATE from "./Home.html";

class Home extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public handleClick(name: string): void {
		this.$c().send('navigate', name).onChannel('navigation').toContext();
	}

}

export default Home;
