import { Component } from "@cydran/cydran";
import TEMPLATE from "./WatchClosureGcSpecimen.html";

/**
 * Specimen: a reactive watch registered by METHOD NAME via
 * `$c().onExpressionValueChange("m().count", this, "onCountChange")`. Registration by name resolves to
 * a prototype method — strongly reachable via the class — so the watch survives forced GC. (Inline
 * closures are no longer accepted by the API, which removes the prior closure-GC footgun by design.)
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
		// Method name — resolves to a prototype method that survives GC.
		this.$c().onExpressionValueChange("m().count", this, "onCountChange");
	}

	public onCountChange(previous: number, current: number): void {
		this.mirrorMethod = "seen=" + current;
	}

	public increment(): void {
		this.count++;
	}

}

export default WatchClosureGcSpecimen;
