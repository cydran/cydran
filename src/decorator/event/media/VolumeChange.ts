import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class VolumeChange extends AbstractEvent {

	protected getEventKey(): string {
		return "volumechange";
	}

}

export default VolumeChange;
