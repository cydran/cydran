import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Progress extends AbstractEvent {

	protected getEventKey(): string {
		return "progress";
	}

}

export default Progress;
