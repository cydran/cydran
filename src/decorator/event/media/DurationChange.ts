import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DurationChange extends AbstractEvent {

	protected getEventKey(): string {
		return "durationchange";
	}

}

export default DurationChange;
