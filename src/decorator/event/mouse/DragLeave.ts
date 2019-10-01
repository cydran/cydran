import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DragLeave extends AbstractEvent {

	protected getEventKey(): string {
		return "dragleave";
	}

}

export default DragLeave;
