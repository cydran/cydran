import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DragEnd extends AbstractEvent {

	protected getEventKey(): string {
		return "dragend";
	}

}

export default DragEnd;
