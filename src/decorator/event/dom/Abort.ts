import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Abort extends AbstractEvent {

	protected getEventKey(): string {
		return "abort";
	}

}

export default Abort;
