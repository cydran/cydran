import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class MouseWheel extends AbstractEvent {

	protected getEventKey(): string {
		return "mousewheel";
	}

}

export default MouseWheel;
