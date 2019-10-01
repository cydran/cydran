import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Undo extends AbstractEvent {

	protected getEventKey(): string {
		return "undo";
	}

}

export default Undo;
