import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class PopState extends AbstractEvent {

	protected getEventKey(): string {
		return "popstate";
	}

}

export default PopState;
