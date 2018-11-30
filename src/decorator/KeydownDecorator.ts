import {Decorator} from "../Core";

class KeydownElementDecorator extends Decorator<Function> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		document.addEventListener('keydown', this.listener, false);
	}

	public unwire(): void {
		document.removeEventListener('keydown', this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		this.invokeTarget(event);
	}

	protected onTargetChange(previous: any, current: any): void {
		// Intentionally do nothing
	}

	protected isEvaluatable(): boolean {
		return false;
	}

}

export default KeydownElementDecorator;
