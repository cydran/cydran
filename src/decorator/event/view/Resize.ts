import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Resize extends AbstractEvent {

	protected getEventKey(): string {
		return "resize";
	}

}

export default Resize;
