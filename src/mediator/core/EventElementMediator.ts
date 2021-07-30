import { asIdentity } from "util/AsFunctions";
import AbstractInvokingElementMediator from "mediator/AbstractInvokingElementMediator";
import { DOM_KEY } from "Constants";

class EventElementMediator extends AbstractInvokingElementMediator<any, HTMLElement, any> {

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
			this.getModelMediator().invoke({
				$event: event
			});
		}, [event]);
	}

	public setEventKey(eventKey: string): void {
		this.eventKey = eventKey;
	}

}

export default EventElementMediator;
