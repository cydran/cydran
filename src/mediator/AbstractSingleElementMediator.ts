import AbstractElementMediator from "mediator/AbstractElementMediator";

abstract class AbstractSingleElementMediator<M, E extends HTMLElement | Text, P> extends AbstractElementMediator<M, E, P> {

	constructor(reducerFn: (input: any) => M) {
		super(reducerFn);
	}

	public onPopulate(): void {
		// Intentionally do nothing
	}

}

export default AbstractSingleElementMediator;
