import AbstractElementMediator from "mediator/AbstractElementMediator";

// tslint:disable-next-line:max-line-length
abstract class AbstractInvokingElementMediator<M, E extends HTMLElement | Text, P> extends AbstractElementMediator<M, E, P> {

	constructor(reducerFn: (input: any) => M) {
		super(reducerFn);
	}

	public onPopulate(): void {
		// Intentionally do nothing
	}

}

export default AbstractInvokingElementMediator;