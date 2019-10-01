import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Cut extends AbstractEvent {

	protected getEventKey(): string {
		return "cut";
	}

}

export default Cut;
