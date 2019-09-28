import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class SearchEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "search";
	}

}

export default SearchEventDecorator;
