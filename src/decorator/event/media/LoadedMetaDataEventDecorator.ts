import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class LoadedMetaDataEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "loadedmetadata";
	}
	
}

export default LoadedMetaDataEventDecorator;
