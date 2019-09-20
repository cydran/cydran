import {AbstractEventDecorator} from "../AbstractEventDecorator";

class LoadedMetaDataEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("loadedmetadata");
		this.listenTo("dom", "loadedmetadata", this.handleEvent);
	}

}

export default LoadedMetaDataEventDecorator;
