import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Wheel extends AbstractEvent {

	protected getEventKey(): string {
		return "wheel";
	}

}

export default Wheel;
