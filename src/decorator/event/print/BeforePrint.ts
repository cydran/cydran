import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class BeforePrint extends AbstractEvent {

	protected getEventKey(): string {
		return "beforeprint";
	}

}

export default BeforePrint;
