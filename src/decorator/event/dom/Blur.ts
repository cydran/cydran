import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Blur extends AbstractEvent {

	protected getEventKey(): string {
		return "blur";
	}

}

export default Blur;
