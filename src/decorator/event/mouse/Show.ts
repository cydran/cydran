import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Show extends AbstractEvent {

	protected getEventKey(): string {
		return "show";
	}

}

export default Show;
