import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class StorageEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "storage";
	}

}

export default StorageEventDecorator;
