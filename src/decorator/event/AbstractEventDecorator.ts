import { Mvvm, Decorator} from "../../Core";

/**
 * 
 */
abstract class AbstractEventDecorator extends Decorator<Function> {

	/**
	 * Opposite of the wire() method
	 */
	public unwire(): void {
		// Intentionally do nothing
	}

	/**
	 * Make the event available to the mediator and notify for model interaction
	 * @param {Event} event DOM event passed to this [[Decorator|decorator]]
	 */
	public handleEvent(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

	/**
	 * Bind the instantiated event decorator into the DOM
	 */
	public wire(): void {
		this.consume(this.getEventKey());
		this.listenTo("dom", this.getEventKey(), this.handleEvent);
	}

	protected abstract getEventKey(): string;

}

export default AbstractEventDecorator;
