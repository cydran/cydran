import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class MouseOver extends AbstractEvent {

	protected getEventKey(): string {
		return "mouseover";
	}

}

export default MouseOver;
