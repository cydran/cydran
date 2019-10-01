import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class BeforeUnload extends AbstractEvent {

	protected getEventKey(): string {
		return "beforeunload";
	}

}

export default BeforeUnload;
