import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Toggle extends AbstractEvent {

	protected getEventKey(): string {
		return "toggle";
	}

}

export default Toggle;
