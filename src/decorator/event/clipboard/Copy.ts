import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Copy extends AbstractEvent {

	protected getEventKey(): string {
		return "copy";
	}

}

export default Copy;
