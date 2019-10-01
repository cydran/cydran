import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class CanPlay extends AbstractEvent {

	protected getEventKey(): string {
		return "canplay";
	}

}

export default CanPlay;
