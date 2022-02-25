import AbstractBehavior from "behavior/AbstractBehavior";
import { DOM_KEY } from "Constants";
import { requireNotNull } from 'util/Utils';

class EventBehavior extends AbstractBehavior<any, HTMLElement, any> {

	private eventKey: string;

	constructor(eventKey: string) {
		super();
		this.eventKey = requireNotNull(eventKey, "eventKey");
	}

	public onInit(): void {
		this.bridge(this.eventKey);
		this.on(this.eventKey).forChannel(DOM_KEY).invoke(this.handleEvent);
	}

	public handleEvent(event: Event): void {
		this.invoke({$event: event});
	}

}

export default EventBehavior;
