import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Online extends AbstractEvent {

	protected getEventKey(): string {
		return "online";
	}

}

export default Online;
