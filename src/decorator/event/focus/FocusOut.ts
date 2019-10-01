import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class FocusOut extends AbstractEvent {

	protected getEventKey(): string {
		return "focusout";
	}

}

export default FocusOut;
