import { Component, Logger, requireNotNull } from "@cydran/cydran";
import TEMPLATE from "./Logging.html";

class Logging extends Component {

	private key: string;

	private value: string;

	private logger: Logger;

	constructor(logger: Logger) {
		super(TEMPLATE);
		this.key = "cydran.logging.level";
		this.value = "";
		this.logger = requireNotNull(logger, "logger");
		// this.$c().onInterval(2000).invoke(this.handleLogging);
	}

	public handleApply(): void {
		this.$c().getContext().getProperties().set(this.key, this.value);
		}

	public handleLogging(): void {
		this.logger.trace("This was trace");
		this.logger.debug("This was debug");
		this.logger.info("This was info");
		// this.logger.warn({ msg: "This was warn"});
		// this.logger.error({ msg: "This was error"});
		// this.logger.fatal({ msg: "This was fatal"});
		this.logger.warn("Error", new Error("This was warn"));
		this.logger.error("Error", new Error("This was error"));
		this.logger.fatal("Error", new Error("This was fatal"));
	}

}

export default Logging;
