import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Paste extends AbstractEvent {

	protected getEventKey(): string {
		return "paste";
	}

}

export default Paste;
