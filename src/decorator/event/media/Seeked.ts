import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Seeked extends AbstractEvent {

	protected getEventKey(): string {
		return "seeked";
	}

}

export default Seeked;
