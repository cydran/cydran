import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class FullScreenError extends AbstractEvent {

	protected getEventKey(): string {
		return "fullscreenerror";
	}

}

export default FullScreenError;
