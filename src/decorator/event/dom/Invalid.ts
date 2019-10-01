import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Invalid extends AbstractEvent {

	protected getEventKey(): string {
		return "invalid";
	}

}

export default Invalid;
