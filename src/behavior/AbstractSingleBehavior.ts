import AbstractBehavior from "behavior/AbstractBehavior";

abstract class AbstractSingleBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor(reducerFn: (input: any) => M) {
		super(reducerFn);
	}

	public onPopulate(): void {
		// Intentionally do nothing
	}

}

export default AbstractSingleBehavior;