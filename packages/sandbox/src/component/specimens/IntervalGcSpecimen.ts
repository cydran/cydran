import { Component } from "@cydran/cydran";
import TEMPLATE from "./IntervalGcSpecimen.html";

/**
 * Specimen: a recurring interval registered with a METHOD REFERENCE via
 * `$c().onInterval(ms).invoke(this.onTick)`. IntervalImpl holds both its thisObject and callback via
 * WeakRef, so a method reference (strongly reachable via the class) is the safe way to keep an
 * interval alive; an inline closure would be collectable. Verifies the interval keeps ticking after GC.
 */
class IntervalGcSpecimen extends Component {

	private ticks: number;

	constructor() {
		super(TEMPLATE);
		this.ticks = 0;
		this.$c().onInterval(200).invoke(this.onTick);
	}

	public onTick(): void {
		this.ticks++;
	}

}

export default IntervalGcSpecimen;
