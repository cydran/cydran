import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Focus extends AbstractEvent {

	protected getEventKey(): string {
		return "focus";
	}

}

export default Focus;
