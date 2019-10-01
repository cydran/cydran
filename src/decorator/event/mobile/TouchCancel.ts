import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class TouchCancel extends AbstractEvent {

	protected getEventKey(): string {
		return "touchcancel";
	}

}

export default TouchCancel;
