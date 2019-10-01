import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class RateChange extends AbstractEvent {

	protected getEventKey(): string {
		return "ratechange";
	}

}

export default RateChange;
