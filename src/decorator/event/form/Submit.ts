import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Submit extends AbstractEvent {

	protected getEventKey(): string {
		return "submit";
	}

}

export default Submit;
