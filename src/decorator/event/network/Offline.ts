import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Offline extends AbstractEvent {

	protected getEventKey(): string {
		return "offline";
	}

}

export default Offline;
