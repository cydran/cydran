import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Change extends AbstractEvent {

	protected getEventKey(): string {
		return "change";
	}

}

export default Change;
