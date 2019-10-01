import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DblClick extends AbstractEvent {

	protected getEventKey(): string {
		return "dblclick";
	}

}

export default DblClick;
