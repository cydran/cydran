import {AbstractEventDecorator} from "../AbstractEventDecorator";

class LoadedDataEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("loadeddata");
		this.listenTo("dom", "loadeddata", this.handleEvent);
	}

}

export default LoadedDataEventDecorator;
