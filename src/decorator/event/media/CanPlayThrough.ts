import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class CanPlayThrough extends AbstractEvent {

	protected getEventKey(): string {
		return "canplaythrough";
	}

}

export default CanPlayThrough;
