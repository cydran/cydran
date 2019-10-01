import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Drop extends AbstractEvent {

	protected getEventKey(): string {
		return "drop";
	}

}

export default Drop;
