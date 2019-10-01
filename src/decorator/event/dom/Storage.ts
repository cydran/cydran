import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Storage extends AbstractEvent {

	protected getEventKey(): string {
		return "storage";
	}

}

export default Storage;
