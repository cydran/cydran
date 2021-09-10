import AbstractBehavior from "behavior/AbstractBehavior";

// tslint:disable-next-line:max-line-length
abstract class AbstractInvokingBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor(reducerFn: (input: any) => M) {
		super(reducerFn);
	}

}

export default AbstractInvokingBehavior;
