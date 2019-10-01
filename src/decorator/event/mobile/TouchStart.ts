import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class TouchStart extends AbstractEvent {

	protected getEventKey(): string {
		return "touchstart";
	}

}

export default TouchStart;
