import { asIdentity } from "util/AsFunctions";
import AbstractBehavior from "behavior/AbstractBehavior";
import { DOM_KEY } from "Constants";

class EventBehavior extends AbstractBehavior<any, HTMLElement, any> {

	private eventKey: string;

	public onInit(): void {
		this.bridge(this.eventKey);
		this.on(this.eventKey).forChannel(DOM_KEY).invoke(this.handleEvent);
	}

	public handleEvent(event: Event): void {
		this.$apply(() => {
			this.getMediator().invoke({
				$event: event
			});
		}, [event]);
	}

	public setEventKey(eventKey: string): void {
		this.eventKey = eventKey;
	}

}

export default EventBehavior;
