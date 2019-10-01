import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Unload extends AbstractEvent {

	protected getEventKey(): string {
		return "unload";
	}

}

export default Unload;
