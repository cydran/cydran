import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class LoadedMetaDataEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "loadedmetadata";
	}
	
}

export default LoadedMetaDataEventDecorator;
