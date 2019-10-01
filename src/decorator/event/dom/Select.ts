import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Select extends AbstractEvent {

	protected getEventKey(): string {
		return "select";
	}

}

export default Select;
