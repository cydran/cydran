import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class MouseMove extends AbstractEvent {

	protected getEventKey(): string {
		return "mouseover";
	}

}

export default MouseMove;
