import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Emptied extends AbstractEvent {

	protected getEventKey(): string {
		return "emptied";
	}

}

export default Emptied;
