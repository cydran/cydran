import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class ReadyStateChange extends AbstractEvent {

	protected getEventKey(): string {
		return "readystatechange";
	}

}

export default ReadyStateChange;
