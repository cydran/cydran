import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class StorageEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "storage";
	}

}

export default StorageEventDecorator;
