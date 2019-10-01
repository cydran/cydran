import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Ended extends AbstractEvent {

	protected getEventKey(): string {
		return "ended";
	}

}

export default Ended;
