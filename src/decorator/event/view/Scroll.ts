import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Scroll extends AbstractEvent {

	protected getEventKey(): string {
		return "scroll";
	}

}

export default Scroll;
