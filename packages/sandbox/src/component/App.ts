import { Component, Events } from "@cydran/cydran";
import TEMPLATE from "./App.html";

class App extends Component {

	private value: {
		first: string;
	};

	constructor() {
		super(TEMPLATE, {
			styles: "font-size: 20px;"
		});
		this.$c().onMessage("navigate").forChannel("navigation").invoke(this.navigate);
		this.$c().onMessage(Events.AFTER_CHILD_CHANGED).invoke(this.onRegionChange);
		this.value = {
			first: "A parent value"
		};
	}

	public navigate(name: string): void {
		this.$c().regions().setByObjectId("body", 'page:' + name, 'page:notFound');
	}

	public onRegionChange(payload: { name: string; }): void {
		this.$c().getLogger().ifTrace(() => "Updated region: " + payload.name);
	}

}

export default App;
