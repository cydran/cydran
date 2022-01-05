import AbstractBehavior from 'behavior/AbstractBehavior';

abstract class AbstractValueBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor() {
		super();
	}

	public onMount(): void {
		super.onMount();

		this.onChange(null, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onChange);
		}
	}

	protected abstract onChange(previous: M, current: M): void;

}

export default AbstractValueBehavior;
