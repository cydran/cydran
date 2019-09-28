import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class VolumeChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "volumechange";
	}

}

export default VolumeChangeEventDecorator;
