import {AbstractEventDecorator} from "../AbstractEventDecorator";

class StorageEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("storage");
		this.listenTo("dom", "storage", this.handleEvent);
	}

}

export default StorageEventDecorator;
