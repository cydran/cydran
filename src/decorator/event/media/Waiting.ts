import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Waiting extends AbstractEvent {

	protected getEventKey(): string {
		return "waiting";
	}

}

export default Waiting;
