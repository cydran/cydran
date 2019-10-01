import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Stalled extends AbstractEvent {

	protected getEventKey(): string {
		return "stalled";
	}

}

export default Stalled;
