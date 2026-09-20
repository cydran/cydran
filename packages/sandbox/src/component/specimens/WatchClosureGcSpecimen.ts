import { Component } from "@cydran/cydran";
import TEMPLATE from "./WatchClosureGcSpecimen.html";

/**
 * Specimen: a user-style reactive watch registered with an INLINE closure via
 * `$c().onExpressionValueChange("m().count", (p, c) => ...)`. The closure is held only weakly by the
 * mediator; this specimen exists to demonstrate — under forced GC — that such a watch stops firing,
 * versus a method-reference watch which survives (see the two mirrors in the template).
 */
class WatchClosureGcSpecimen extends Component {

	private count: number;

	private mirror: string;

	private mirrorMethod: string;

	constructor() {
		super(TEMPLATE);
		this.count = 0;
		this.mirror = "unseen";
		this.mirrorMethod = "unseen";
		// Registered in the constructor (component onInit is not a called hook).
		// (1) Inline closure — the natural app-developer style whose GC-safety we are probing.
		this.$c().onExpressionValueChange("m().count", (previous: number, current: number) => {
			this.mirror = "seen=" + current;
		});
		// (2) Method reference — the established convention (all framework/sandbox usage). Expected to
		// survive GC because a prototype method is strongly reachable via the class.
		this.$c().onExpressionValueChange("m().count", this.onCountChange);
	}

	public onCountChange(previous: number, current: number): void {
		this.mirrorMethod = "seen=" + current;
	}

	public increment(): void {
		this.count++;
	}

}

export default WatchClosureGcSpecimen;
