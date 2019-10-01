import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Load extends AbstractEvent {

	protected getEventKey(): string {
		return "load";
	}

}

export default Load;
