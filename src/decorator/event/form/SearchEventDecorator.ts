import {AbstractEventDecorator} from "../AbstractEventDecorator";

class SearchEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("search");
		this.listenTo("dom", "search", this.handleEvent);
	}

}

export default SearchEventDecorator;
