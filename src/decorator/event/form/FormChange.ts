import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class FormChange extends AbstractEvent {

	protected getEventKey(): string {
		return "formchange";
	}

}

export default FormChange;
