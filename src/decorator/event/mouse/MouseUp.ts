import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class MouseUp extends AbstractEvent {

	protected getEventKey(): string {
		return "mouseup";
	}

}

export default MouseUp;
