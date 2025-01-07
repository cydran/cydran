import { Component } from "@cydran/cydran";
import TEMPLATE from "./Logging.html";

class Logging extends Component {

	private key: string;

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.key = "cydran.logging.level";
		this.value = "";
		this.$c().onInterval(2000).invoke(this.handleInterval);
	}

	public handleApply(): void {
		this.$c().getContext().getProperties().set(this.key, this.value);
	}

	public handleInterval(): void {
		this.$c().getLogger().trace({ msg: "This was trace"});
		this.$c().getLogger().debug({ msg: "This was debug"});
		this.$c().getLogger().info({ msg: "This was info"});
		// this.$c().getLogger().warn({ msg: "This was warn"});
		// this.$c().getLogger().error({ msg: "This was error"});
		// this.$c().getLogger().fatal({ msg: "This was fatal"});
		this.$c().getLogger().warn(new Error("This was warn"));
		this.$c().getLogger().error(new Error("This was error"));
		this.$c().getLogger().fatal(new Error("This was fatal"));

		console.log("Invoked");
	}

}

export default Logging;
