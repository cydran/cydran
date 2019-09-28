import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class LoadedDataEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "loadeddata";
	}

}

export default LoadedDataEventDecorator;
