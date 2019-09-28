import AbstractEventDecorator from "../AbstractEventDecorator";

class SearchEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "search";
	}

}

export default SearchEventDecorator;
