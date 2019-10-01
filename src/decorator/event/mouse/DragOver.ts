import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DragOver extends AbstractEvent {

	protected getEventKey(): string {
		return "dragover";
	}

}

export default DragOver;
