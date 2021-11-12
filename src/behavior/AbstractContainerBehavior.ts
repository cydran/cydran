import AbstractBehavior from 'behavior/AbstractBehavior';
import BehaviorFlags from "behavior/BehaviorFlags";
import DigestableSource from "behavior/DigestableSource";

abstract class AbstractContainerBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor() {
		super();
		this.setFlag(BehaviorFlags.PROPAGATION);
	}

	public abstract requestDigestionSources(sources: DigestableSource[]): void;

}

export default AbstractContainerBehavior;
