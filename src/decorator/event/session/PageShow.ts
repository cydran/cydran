import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class PageShow extends AbstractEvent {

	protected getEventKey(): string {
		return "pageshow";
	}

}

export default PageShow;
