import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Suspend extends AbstractEvent {

	protected getEventKey(): string {
		return "suspend";
	}

}

export default Suspend;
