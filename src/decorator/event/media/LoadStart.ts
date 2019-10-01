import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class LoadStart extends AbstractEvent {

	protected getEventKey(): string {
		return "loadstart";
	}

}

export default LoadStart;
