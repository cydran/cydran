import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class VolumeChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "volumechange";
	}

}

export default VolumeChangeEventDecorator;
