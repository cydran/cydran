import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Error extends AbstractEvent {

	protected getEventKey(): string {
		return "error";
	}

}

export default Error;
