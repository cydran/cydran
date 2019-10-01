import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class LoadedMetaData extends AbstractEvent {

	protected getEventKey(): string {
		return "loadedmetadata";
	}
	
}

export default LoadedMetaData;
