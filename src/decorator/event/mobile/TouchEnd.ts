import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class TouchEnd extends AbstractEvent {

	protected getEventKey(): string {
		return "touchend";
	}

}

export default TouchEnd;
