import ElementMediator from "@/element/ElementMediator";
import { asIdentity } from "@/model/Reducers";

class EventElementMediator extends ElementMediator<any, HTMLElement, any> {

	private eventKey: string;

	constructor(dependencies: any) {
		super(dependencies, false, asIdentity);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleEvent(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().invoke({
				$event: event
			});
		}, [event]);
	}

	public wire(): void {
		this.bridge(this.eventKey);
		this.on(this.eventKey).forChannel("dom").invoke(this.handleEvent);
	}

	public setEventKey(eventKey: string): void {
		this.eventKey = eventKey;
	}

}

export default EventElementMediator;
