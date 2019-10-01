import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class PageHide extends AbstractEvent {

	protected getEventKey(): string {
		return "pagehide";
	}

}

export default PageHide;
