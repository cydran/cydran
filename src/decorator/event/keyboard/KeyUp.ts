import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class KeyUp extends AbstractEvent {

	protected getEventKey(): string {
		return "keyup";
	}

}

export default KeyUp;
