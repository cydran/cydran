import { Component, MutableProperties } from "@cydran/cydran";
import TEMPLATE from "./PropertyObserverGcSpecimen.html";

const KEY: string = "gcTestKey";

/**
 * Specimen: a property observer registered with a METHOD REFERENCE via
 * `properties().addPropertyObserver(key, this, this.onPropChange)`. Property observers are held weakly
 * (ObservableImpl), so a method reference is the safe way to keep the observer alive; an inline closure
 * would be collectable. Verifies the observer keeps firing after GC.
 */
class PropertyObserverGcSpecimen extends Component {

	private n: number;

	private observed: string;

	private props: MutableProperties;

	constructor() {
		super(TEMPLATE);
		this.n = 0;
		this.observed = "none";
		this.props = null as unknown as MutableProperties;
	}

	public onMount(): void {
		// `properties()` guards readiness, so register once the component is mounted (ready), not in
		// the constructor.
		this.props = this.$c().properties() as unknown as MutableProperties;
		this.props.addPropertyObserver(KEY, this, this.onPropChange);
	}

	public onPropChange(value: unknown): void {
		this.observed = "got=" + value;
	}

	public bump(): void {
		this.n++;
		this.props.set(KEY, this.n);
	}

}

export default PropertyObserverGcSpecimen;
