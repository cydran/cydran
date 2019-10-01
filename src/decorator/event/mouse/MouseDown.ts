import AbstractEvent from "../AbstractEvent";

/**
 *
 */
class MouseDown extends AbstractEvent {

	protected getEventKey(): string {
		return "mousedown";
	}

}

export default MouseDown;
