import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class KeyDown extends AbstractEvent {

	protected getEventKey(): string {
		return "keydown";
	}

}

export default KeyDown;
