import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Playing extends AbstractEvent {

	protected getEventKey(): string {
		return "playing";
	}

}

export default Playing;
