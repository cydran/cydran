import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Click extends AbstractEvent {

	protected getEventKey(): string {
		return "click";
	}

}

export default Click;
