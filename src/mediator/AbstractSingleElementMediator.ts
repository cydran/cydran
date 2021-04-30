import AbstractBaseElementMediator from "mediator/AbstractBaseElementMediator";

abstract class AbstractSingleElementMediator<M, E extends HTMLElement | Text, P> extends AbstractBaseElementMediator<M, E, P> {

	constructor(reducerFn: (input: any) => M) {
		super(reducerFn);
	}

	public onPopulate(): void {
		// Intentionally do nothing
	}

}

export default AbstractSingleElementMediator;
