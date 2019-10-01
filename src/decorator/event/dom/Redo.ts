import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Redo extends AbstractEvent {

	protected getEventKey(): string {
		return "redo";
	}

}

export default Redo;
