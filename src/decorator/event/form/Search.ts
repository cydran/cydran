import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Search extends AbstractEvent {

	protected getEventKey(): string {
		return "search";
	}

}

export default Search;
