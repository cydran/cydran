import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class FocusIn extends AbstractEvent {

	protected getEventKey(): string {
		return "focusin";
	}

}

export default FocusIn;
