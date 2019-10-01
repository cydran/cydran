import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Reset extends AbstractEvent {

	protected getEventKey(): string {
		return "reset";
	}

}

export default Reset;
