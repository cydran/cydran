import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class FullScreenChange extends AbstractEvent {

	protected getEventKey(): string {
		return "fullscreenchange";
	}

}

export default FullScreenChange;
