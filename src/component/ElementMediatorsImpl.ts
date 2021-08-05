import ElementMediators from "component/ElementMediators";
import ElementMediator from "mediator/ElementMediator";
import { requireNotNull } from 'util/Utils';

class ElementMediatorsImpl implements ElementMediators {

	private mediators: ElementMediator<any, HTMLElement | Text, any>[];

	constructor() {
		this.mediators = [];
	}

	public $dispose(): void {
		for (const mediator of this.mediators) {
			mediator.$dispose();
		}

		this.mediators = [];
	}

	public tell(name: string, payload?: any): void {
		for (const mediator of this.mediators) {
			mediator.tell(name, payload);
		}
	}

	public add(mediator: ElementMediator<any, HTMLElement | Text, any>): void {
		requireNotNull(mediator, "mediator");

		this.mediators.push(mediator);
	}

	public isEmpty(): boolean {
		return this.mediators.length === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

}

export default ElementMediatorsImpl;
