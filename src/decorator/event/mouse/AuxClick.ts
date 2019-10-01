import AbstractEvent from "../AbstractEvent";

/**
 *
 */
class AuxClick extends AbstractEvent {

	protected getEventKey(): string {
		return "auxclick";
	}

}

export default AuxClick;
