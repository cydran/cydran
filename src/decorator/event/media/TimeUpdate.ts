import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class TimeUpdate extends AbstractEvent {

	protected getEventKey(): string {
		return "timeupdate";
	}

}

export default TimeUpdate;
