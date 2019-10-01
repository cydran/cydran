import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class KeyPress extends AbstractEvent {

	protected getEventKey(): string {
		return "keypress";
	}

}

export default KeyPress;
