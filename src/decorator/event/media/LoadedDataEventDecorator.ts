import AbstractEventDecorator from "../AbstractEventDecorator";

class LoadedDataEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "loadeddata";
	}

}

export default LoadedDataEventDecorator;
