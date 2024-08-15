import AbstractBehavior from 'behavior/AbstractBehavior';
import InternalBehaviorFlags from "behavior/InternalBehaviorFlags";
import DigestableSource from "behavior/DigestableSource";

abstract class AbstractContainerBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor() {
		super();
		this.setFlag(InternalBehaviorFlags.PROPAGATION);
	}

	public abstract requestDigestionSources(sources: DigestableSource[]): void;

}

export default AbstractContainerBehavior;
