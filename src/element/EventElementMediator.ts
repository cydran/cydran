import ElementMediator from "@/element/ElementMediator";
import { asIdentity } from "@/model/Reducers";
import Validators from "@/validation/Validators";

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

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

export default EventElementMediator;
