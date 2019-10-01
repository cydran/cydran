import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DragEnter extends AbstractEvent {

	protected getEventKey(): string {
		return "dragenter";
	}

}

export default DragEnter;
