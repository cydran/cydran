import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class AfterPrint extends AbstractEvent {

	protected getEventKey(): string {
		return "afterprint";
	}

}

export default AfterPrint;
