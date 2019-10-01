import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Drag extends AbstractEvent {

	protected getEventKey(): string {
		return "drag";
	}

}

export default Drag;
