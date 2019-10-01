import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class LoadedData extends AbstractEvent {

	protected getEventKey(): string {
		return "loadeddata";
	}

}

export default LoadedData;
