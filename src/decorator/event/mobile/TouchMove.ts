import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class TouchMove extends AbstractEvent {

	protected getEventKey(): string {
		return "touchmove";
	}

}

export default TouchMove;
