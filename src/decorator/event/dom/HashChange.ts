import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class HashChange extends AbstractEvent {

	protected getEventKey(): string {
		return "hashchange";
	}

}

export default HashChange;
