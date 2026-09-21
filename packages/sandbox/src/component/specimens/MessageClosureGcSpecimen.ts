import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./MessageClosureGcSpecimen.html";

/**
 * Specimen: message subscriptions registered two ways — an INLINE closure and a METHOD REFERENCE —
 * on the same channel. The component sends to its own context on a button press. Demonstrates, under
 * forced GC, that the closure subscription stops receiving while the method-ref subscription survives.
 */
class MessageClosureGcSpecimen extends Component {

	private n: number;

	private viaClosure: string;

	private viaMethod: string;

	constructor() {
		super(TEMPLATE);
		this.n = 0;
		this.viaClosure = "none";
		this.viaMethod = "none";
		// (1) Inline closure — the footgun: held only weakly by the message registry.
		this.$c().onMessage("ping").forChannel("gcTest").invoke((payload: unknown) => {
			this.viaClosure = "got=" + payload;
		});
		// (2) Method reference — the safe/idiomatic pattern (strongly reachable via the class).
		this.$c().onMessage("ping").forChannel("gcTest").invoke(this.onPing);
	}

	public onPing(payload: unknown): void {
		this.viaMethod = "got=" + payload;
	}

	public sendPing(): void {
		this.n++;
		this.$c().send("ping", this.n).onChannel("gcTest").withPropagation(To.CONTEXT);
	}

}

export default MessageClosureGcSpecimen;
