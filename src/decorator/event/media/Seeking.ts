import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Seeking extends AbstractEvent {

	protected getEventKey(): string {
		return "seeking";
	}

}

export default Seeking;
