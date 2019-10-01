import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Pause extends AbstractEvent {

	protected getEventKey(): string {
		return "pause";
	}

}

export default Pause;
