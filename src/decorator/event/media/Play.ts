import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Play extends AbstractEvent {

	protected getEventKey(): string {
		return "play";
	}

}

export default Play;
