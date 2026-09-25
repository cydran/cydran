import { Component } from "@cydran/cydran";
import TEMPLATE from "./RaceDiagnosticSpecimen.html";

/**
 * Specimen: two behaviors on the same input — `c-model` (ValuedModelBehavior) and `c-oninput`
 * (EventBehavior) — both listening to the same `input` event. `bumps` witnesses that the event
 * reached Cydran; `value` shows whether c-model propagated it. A mismatch (bumps > 0, value
 * unchanged) is the cydran/cydran#825 drop.
 */
class RaceDiagnosticSpecimen extends Component {

	private value: string;

	private bumps: number;

	constructor() {
		super(TEMPLATE);
		this.value = "initial";
		this.bumps = 0;
	}

	public bump(): void {
		this.bumps++;
	}

}

export default RaceDiagnosticSpecimen;
