import { asIdentity } from "util/AsFunctions";
import AbstractInvokingBehavior from "behavior/AbstractInvokingBehavior";
import { DOM_KEY } from "Constants";

class EventBehavior extends AbstractInvokingBehavior<any, HTMLElement, any> {

	private eventKey: string;

	constructor() {
		super(asIdentity);
	}

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
