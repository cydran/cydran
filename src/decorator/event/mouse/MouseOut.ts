import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class MouseOut extends AbstractEvent {

	protected getEventKey(): string {
		return "mouseout";
	}

}

export default MouseOut;
