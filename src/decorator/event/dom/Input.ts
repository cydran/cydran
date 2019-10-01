import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Input extends AbstractEvent {

	protected getEventKey(): string {
		return "input";
	}

}

export default Input;
