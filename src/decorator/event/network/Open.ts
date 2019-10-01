import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Open extends AbstractEvent {

	protected getEventKey(): string {
		return "open";
	}

}

export default Open;
