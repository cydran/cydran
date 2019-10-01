import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Close extends AbstractEvent {

	protected getEventKey(): string {
		return "close";
	}

}

export default Close;
